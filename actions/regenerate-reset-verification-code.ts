"use server";
import { findOne } from "@/data/reset-password";
import { connectToDatabase } from "@/lib/db";
import { otpGenerator } from "@/lib/auth-utils";
import {
  generateResetEmailHtml
} from "@/lib/mail-html-template";
import { sendEmail } from "@/lib/mail";
import { rateLimit } from "@/lib/rate-limit";
import getUserIpAddress from "@/hooks/get-user-ip-address";
export const regenerateResetVerificationCode = async (email: string) => {
  const lowercaseEmail = email.toLowerCase()
  const userIp = await getUserIpAddress();
  const { error } = rateLimit(userIp, false);
  if(error)  return {
    error,
    success: undefined
  };
  const { verificationCode, expiresAt } = otpGenerator();
  try {
    await connectToDatabase();
    const user = await findOne({userEmail: lowercaseEmail});
    if (!user) {
      return {
        error: "User not found, Check email and try again",
        success: undefined,
      };
    }

   

    user.code = verificationCode;
    user.expiresAt = expiresAt;
    const currentYear = new Date().getFullYear();
    const subject = "Reset Your Password";
    const text = `We received a request to reset your password. Your OTP code is: ${verificationCode}. This code will expire in 1 hour. If you did not request a password reset, please ignore this message or contact support.`;
    const html = generateResetEmailHtml(verificationCode, currentYear);
    await sendEmail(user.userEmail, subject, text, html);
    await user.save();

    return {
      success: "New verification code sent to your email",
      error: undefined,
    };
  } catch (err) {
    console.error(`error while regenerating email verification code: ${err}`);
    
    return {
      error: "An unknown error occurred.",
      success: undefined,
    };
  }
};
