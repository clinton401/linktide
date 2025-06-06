"use server"
import * as z from "zod";
import { findById } from "@/data/users-data";
import { OtpSchema } from "@/schemas";
import { Types } from "mongoose";
import { connectToDatabase } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";
import getUserIpAddress from "@/hooks/get-user-ip-address";

export const verifyEmail = async (
  values: z.infer<typeof OtpSchema>,
  userId: string,
  redirect: string | null
) => {
  const validatedFields = OtpSchema.safeParse(values);
  if (!validatedFields.success) {
    return {
      error: "Invalid code",
      success: undefined,
      redirectUrl: undefined,
    };
  }

  if(!userId || !Types.ObjectId.isValid(userId)) {
    return {
      error: "Invalid userId",
      success: undefined,
      redirectUrl: undefined,
    };
  }
  const userIp = await getUserIpAddress();
  const { error } = rateLimit(userIp, false);
  if (error) return {
    error,
    success: undefined,
    redirectUrl: undefined
  };
  const validId = new Types.ObjectId(userId);
  const { otp } = validatedFields.data;
  

  try {
    await connectToDatabase();
    const user = await findById(validId);
    if (!user) {
      return {
        error: "User not found",
        success: undefined,
        redirectUrl: undefined,
      };
    }

    if (!user.emailVerification) {
      return {
        error: "No verification data available for the user",
        success: undefined,
        redirectUrl: undefined,
      };
    }

    if (user.emailVerification.verified) {
      return {
        success: "Email has already been registered",
        redirectUrl: `/auth/login${redirect ? `?redirect=${encodeURIComponent(redirect)}`: ""}`,
        error: undefined,
      };
    }

    const expiresAtDate = user.emailVerification.expiresAt ? new Date(user.emailVerification.expiresAt) : null;
    const hasExpired = expiresAtDate && !isNaN(expiresAtDate.getTime()) ? expiresAtDate < new Date() : false;
    
    if (hasExpired) {
      return {
        error: "Code has expired, generate a new one",
        success: undefined,
        redirectUrl: undefined,
      };
    }
    const isOtpValid = otp.toUpperCase() === user.emailVerification?.code;
    if(!isOtpValid) return {
        error: "Invalid code",
        success: undefined,
        redirectUrl: undefined,
      };

    // Mark the email as verified
    user.emailVerification = {
      code: null,
      expiresAt: null,
      verified: true,
    };

    await user.save();

    return {
      success: "Email verified",
      redirectUrl: `/auth/login${redirect ? `?redirect=${encodeURIComponent(redirect)}`: ""}`,
      error: undefined,
    };
  } catch (err) {
    console.error(`error while verifying email ${err}`);
  
    return {
      error: "An unknown error occurred.",
      success: undefined,
      redirectUrl: undefined,
    };
  }
};
