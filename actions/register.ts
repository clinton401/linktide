"use server"
import * as z from "zod";
import { RegisterSchema } from "@/schemas";
import {
  mongooseError,
  MongooseErrorExtended,
  otpGenerator,
} from "@/lib/auth-utils";
import { sendEmail } from "@/lib/mail";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/user-schema";
import {
  generateVerificationEmailHtml,
} from "@/lib/mail-html-template";
import { rateLimit } from "@/lib/rate-limit";
import getUserIpAddress from "@/hooks/get-user-ip-address";
type RegisterType = {
  error: string | Record<string, string | undefined> | undefined;
  success: string | undefined;
  redirectUrl: string | undefined;
}
export const register = async (values: z.infer<typeof RegisterSchema>, redirect: string | null): Promise<RegisterType> => {
  const validatedFields = RegisterSchema.safeParse(values);
  if (!validatedFields.success) {
    return {
      error: "Invalid fields",
      success: undefined,
      redirectUrl: undefined
    };
  }
  const userIp = await getUserIpAddress();
  const { error } = rateLimit(userIp, false);
  if(error)  return {
    error,
    success: undefined,
    redirectUrl: undefined
  };
  try {
    await connectToDatabase();
    const { email, name, password } = validatedFields.data;
    const lowercaseEmail = email.toLowerCase();
    const { verificationCode, expiresAt } = otpGenerator();
    const currentYear = new Date().getFullYear();
    const subject = "Please verify your email";
    const text = `Thank you for registering with us. Your verification code is: ${verificationCode}. This code will expire in 1 hour. If you did not register for an account, please ignore this message or contact support.`;
    const html = generateVerificationEmailHtml(verificationCode, currentYear);
    const newUser = await User.create({
      email,
      name,
      password,
      image: "",
      "2FA": false,
      emailVerification: {
        code: verificationCode,
        expiresAt,
        verified: false,
      },
    });

    if (!newUser) {
      return {
        error: "User creation failed",
        success: undefined,
        redirectUrl: undefined,
      };
  
      
    }
    await sendEmail(lowercaseEmail, subject, text, html);
      return {
        success: "User created successfully!. Verification code sent to your email",
        redirectUrl: `/auth/verify-email/${newUser.id}${redirect ? `?redirect=${encodeURIComponent(redirect)}`: ""}`,
        error: undefined
      };

  } catch (err) {
    const errObj = mongooseError(err as MongooseErrorExtended);
    if (errObj) {
      return {
        error: errObj,
        success: undefined,
        redirectUrl: undefined
      };
    }
  
    return {
      error: "An unknown error occurred.",
      success: undefined,
      redirectUrl: undefined
    };
  }
};
