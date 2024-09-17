"use server";
import { findById } from "@/data/users-data";
import { Types } from "mongoose";
import { connectToDatabase } from "@/lib/db";
import { otpGenerator } from "@/lib/auth-utils";
import {
    generateVerificationEmailHtml,
  } from "@/lib/mail-html-template";
import { sendEmail } from "@/lib/mail";
export const regenerateEmailVerificationCode = async (userId: string, redirect: string | null) => {
  if (!userId || !Types.ObjectId.isValid(userId)) {
    return {
      error: "Invalid code",
      success: undefined,
      redirectUrl: undefined,
    };
  }
  const validId = new Types.ObjectId(userId);
  const { verificationCode, expiresAt } = otpGenerator();
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
    user.emailVerification = {
      code: verificationCode,
      expiresAt,
      verified: false,
    };
    const currentYear = new Date().getFullYear();
    const subject = "Please verify your email";
    const text = `Thank you for registering with us. Your verification code is: ${verificationCode}. This code will expire in 1 hour. If you did not register for an account, please ignore this message or contact support.`;
    const html = generateVerificationEmailHtml(verificationCode, currentYear);
    await sendEmail(user.email, subject, text, html);
    await user.save();

    return {
      success: "New verification code sent to your email",
      redirectUrl: undefined,
      error: undefined,
    };
  } catch (err) {
    console.error(`error while regenerating email verification code: ${err}`);
    if (err instanceof Error) {
      return {
        error: err.message,
        success: undefined,
        redirectUrl: undefined,
      };
    }
    return {
      error: "An unknown error occurred.",
      success: undefined,
      redirectUrl: undefined,
    };
  }
};
