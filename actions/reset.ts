"use server";
import { ResetSchema } from "@/schemas";
import * as z from "zod";
import { findOne } from "@/data/users-data";
import { findOne as findOneReset } from "@/data/reset-password";
import { sendEmail } from "@/lib/mail";
import { otpGenerator } from "@/lib/auth-utils";
import { connectToDatabase } from "@/lib/db";
import ResetPassword from "@/models/reset-password-schema";
import {validatePassword} from "@/lib/password-utils"
import {
    generateResetEmailHtml
} from "@/lib/mail-html-template";
import { rateLimit } from "@/lib/rate-limit";
import getUserIpAddress from "@/hooks/get-user-ip-address";
export const reset = async (
  values: z.infer<ReturnType<typeof ResetSchema>>,
  isCodeSent: boolean,
  redirect: string | null
) => {
  const validatedFields = ResetSchema(isCodeSent).safeParse(values);
  if (!validatedFields.success) {
    return {
      error: "Invalid fields",
      success: undefined,
      redirectUrl: undefined,
      isOtpSent: false
    };
  }
  const userIp = await getUserIpAddress();
  const { error } = rateLimit(userIp, false);
  if(error)  return {
    error,
    success: undefined,
    redirectUrl: undefined,
    isOtpSent: false
  };

  const { email, otp, newPassword } = validatedFields.data;
  const { verificationCode, expiresAt } = otpGenerator();
try{

    await connectToDatabase();
  if (!email) {
    return {
      error: "Email is required",
      success: undefined,
      redirectUrl: undefined,
      isOtpSent: false
    };
  }

  const lowerCaseEmail = email.toLowerCase();

  // If code hasn't been sent yet, generate a new OTP
  if (!isCodeSent) {
    const user = await findOne({ email: lowerCaseEmail });
    if (!user) {
      return {
        error: "User not found. Check email and try again",
        success: undefined,
        redirectUrl: undefined,
        isOtpSent: false
      };
    }

    const result = await ResetPassword.findOneAndUpdate(
        { userEmail: lowerCaseEmail },
        { code: verificationCode, expiresAt },
        { upsert: true, new: true }
      );

      if (!result) {
        return {
          error: "Password reset failed",
          success: undefined,
          redirectUrl: undefined,
          isOtpSent: false
        };
      }

    const currentYear = new Date().getFullYear();
    const subject = "Reset Your Password";
    const text = `We received a request to reset your password. Your OTP code is: ${verificationCode}. This code will expire in 1 hour. If you did not request a password reset, please ignore this message or contact support.`;
    const html = generateResetEmailHtml(verificationCode, currentYear);
    

    await sendEmail(lowerCaseEmail, subject, text, html);

    return {
      success: "Password reset request successful! OTP code sent to your email.",
      redirectUrl: undefined,
      error: undefined,
      isOtpSent: true
    };
  }

  if (isCodeSent && (!otp || !newPassword)) {

      return {
        error: "Verification code and new password fields are required",
        success: undefined,
        redirectUrl: undefined,
        isOtpSent: false
      };
    

 
  }
  const foundReset = await findOneReset({userEmail: lowerCaseEmail});
  if(!foundReset) return {
    error: "User not found. Check email and try again",
    success: undefined,
    redirectUrl: undefined,
    isOtpSent: false
  };
  const expiresAtDate = foundReset?.expiresAt ? new Date(foundReset.expiresAt) : null;
  const hasExpired = expiresAtDate && !isNaN(expiresAtDate.getTime()) ? expiresAtDate < new Date() : false;
  if(hasExpired) return {
    error: "Code has expired, generate a new one",
    success: undefined,
    redirectUrl: undefined,
    isOtpSent: false
  }
  
  const isCodeValid = otp?.toUpperCase() === foundReset.code;
  if(!isCodeValid) return {
    error: "Invalid OTP",
    success: undefined,
    redirectUrl: undefined,
    isOtpSent: false
  }

  if(!newPassword || newPassword?.length < 6) return {
    error: "Password must be at least 6 characters long",
    success: undefined,
    redirectUrl: undefined,
    isOtpSent: false
  }
  const foundUser = await findOne({
    email: lowerCaseEmail
  });
  if(!foundUser) return {
    error: "User not found. Check email and try again",
    success: undefined,
    redirectUrl: undefined,
    isOtpSent: false
  };
  if(!foundUser?.password) {
    return {
        error: "Password can't be changed for accounts signed in with an OAuth provider.",
        success: "",
        redirectUrl: undefined,
    isOtpSent: false
    }
}
  const isPasswordTheSameAsLastOne =  await validatePassword(newPassword, foundUser.password);
  if(isPasswordTheSameAsLastOne) return {
    error: "New password cannot be the same as the current one",
    success: undefined,
    redirectUrl: undefined,
    isOtpSent: false
  };
  foundUser.password = newPassword;
  
  const deletedUser = await ResetPassword.findByIdAndDelete(foundReset._id);
  if(!deletedUser) return {
    error: "Something went wrong",
    success: undefined,
    redirectUrl: undefined,
    isOtpSent: false
  };
  await foundUser.save();
  return {
    success: "Password changed successfully",
    error: undefined,
    redirectUrl: `/auth/login${redirect ? `?redirect=${encodeURIComponent(redirect)}`: ""}`,
    isOtpSent: false
  };
} catch(err) {
    console.error(`error while resetting password: ${err}`)
   
      return {
        error: "An unknown error occurred.",
        success: undefined,
        redirectUrl: undefined,
        isOtpSent: false
      };
}
};
