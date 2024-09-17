"use server";
import { findOne } from "@/data/two-fa";
import { connectToDatabase } from "@/lib/db";
import { otpGenerator } from "@/lib/auth-utils";
import {
  generate2FAEmailHtml
} from "@/lib/mail-html-template";
import { sendEmail } from "@/lib/mail";
export const regenerate2faVerificationCode = async (email: string) => {
  const lowercaseEmail = email.toLowerCase()
  
  const { verificationCode, expiresAt } = otpGenerator(true);
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
    const subject = "Your 2-Factor Authentication Code";
      const text = `Your 2FA code for login is: ${verificationCode}. This code will expire in 10 minutes. If you did not request this, please ignore this message or contact support.`;
    const html = generate2FAEmailHtml(verificationCode, currentYear);
    await sendEmail(user.userEmail, subject, text, html);
    await user.save();

    return {
      success: "New Two-Factor Authentication code sent to your email",
      error: undefined,
    };
  } catch (err) {
    console.error(`error while regenerating 2fa verification code: ${err}`);
    if (err instanceof Error) {
      return {
        error: err.message,
        success: undefined,
      };
    }
    return {
      error: "An unknown error occurred.",
      success: undefined,
    };
  }
};
