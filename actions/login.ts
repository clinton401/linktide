"use server";
import * as z from "zod";
import { connectToDatabase } from "@/lib/db";
import { findOne } from "@/data/users-data";
import { findOne as findOne2fa } from "@/data/two-fa";
import TwoFA from "@/models/two-fa-schema";
import { LoginSchema } from "@/schemas";
import { signIn } from "@/auth";
import { sendEmail } from "@/lib/mail";
import { AuthError } from "next-auth";
import { otpGenerator } from "@/lib/auth-utils";
import { validatePassword } from "@/lib/password-utils";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import {
  generateVerificationEmailHtml,
  generate2FAEmailHtml,
} from "@/lib/mail-html-template";
export const login = async (
  values: z.infer<typeof LoginSchema>,
  redirect: string | null,
  is2FA: boolean
) => {
  const validatedFields = LoginSchema.safeParse(values);
  if (!validatedFields.success) {
    return {
      error: "Invalid fields",
      success: undefined,
      redirectUrl: undefined,
    };
  }

  const { twoFA, email, password } = validatedFields.data;
  const lowercaseEmail = email.toLowerCase();

  const currentYear = new Date().getFullYear();
  try {
    await connectToDatabase();
    const user = await findOne({ email: lowercaseEmail });

    if (!user)
      return {
        error: "User not found. Check email and try again",
        success: undefined,
        redirectUrl: undefined,
        isTwoFA: false,
      };
    if (!user.emailVerification) {
      return {
        error: "No verification data available for the user",
        success: undefined,
        redirectUrl: undefined,
        isTwoFA: false,
      };
    }

    if (!user.emailVerification?.verified) {
      const { verificationCode, expiresAt } = otpGenerator();
      user.emailVerification = {
        code: verificationCode,
        expiresAt,
        verified: false,
      };

      const subject = "Please verify your email";
      const text = `Thank you for registering with us. Your verification code is: ${verificationCode}. This code will expire in 1 hour. If you did not register for an account, please ignore this message or contact support.`;
      const html = generateVerificationEmailHtml(verificationCode, currentYear)
      await sendEmail(user.email, subject, text, html);
      await user.save();
      return {
        success:
          "Please verify your email before signing in. A verification link has been sent to your email address",
        redirectUrl: `/auth/verify-email/${user._id}${
          redirect ? `?redirect=${encodeURIComponent(redirect)}` : ""
        }`,
        error: undefined,
        isTwoFA: false,
      };
    }
    if (!user.password) {
      return {
        error: "Invalid credentials",
        success: undefined,
        redirectUrl: undefined,
        isTwoFA: false,
      };
    }
    const isPasswordValid = await validatePassword(password, user.password);
    if (!isPasswordValid) {
      return {
        error: "Invalid credentials. Check password and try again",
        success: undefined,
        redirectUrl: undefined,
        isTwoFA: false,
      };
    }
    const is2FAActive = user["2FA"];

    if (is2FAActive && !is2FA) {
      const { verificationCode, expiresAt } = otpGenerator(true);
      const subject = "Your 2-Factor Authentication Code";
      const text = `Your 2FA code for login is: ${verificationCode}. This code will expire in 10 minutes. If you did not request this, please ignore this message or contact support.`;
      const html = generate2FAEmailHtml(verificationCode, currentYear);

      const result = await TwoFA.findOneAndUpdate(
        { userEmail: lowercaseEmail },
        { code: verificationCode, expiresAt },
        { upsert: true, new: true }
      );

      if (!result) {
        return {
          error: "Two-Factor Authentication failed",
          success: undefined,
          redirectUrl: undefined,
          isTwoFA: false,
        };
      }
      await sendEmail(lowercaseEmail, subject, text, html);
      return {
        success:
          "Your Two-Factor Authentication code has been sent to your email.",
        redirectUrl: undefined,
        error: undefined,
        isTwoFA: true,
      };
    }
    if (is2FAActive && !twoFA) {
      return {
        error: "Two-Factor Authentication field is required",
        success: undefined,
        redirectUrl: undefined,
        isTwoFA: false,
      };
    }
    if(is2FAActive && is2FA ) {
      const found2fa = await findOne2fa({ userEmail: lowercaseEmail });
      if (!found2fa)
        return {
          error: "User not found. Check email and try again",
          success: undefined,
          redirectUrl: undefined,
          isTwoFA: false,
        };
      const expiresAtDate = found2fa?.expiresAt
        ? new Date(found2fa.expiresAt)
        : null;
      const hasExpired =
        expiresAtDate && !isNaN(expiresAtDate.getTime())
          ? expiresAtDate < new Date()
          : false;
      if (hasExpired)
        return {
          error: "Code has expired, generate a new one",
          success: undefined,
          redirectUrl: undefined,
          isTwoFA: false,
        };
  
      const isCodeValid = twoFA?.toUpperCase() === found2fa.code;
      if (!isCodeValid)
        return {
          error: "Invalid Two-Factor Authentication code",
          success: undefined,
          redirectUrl: undefined,
          isTwoFA: false,
        };
      const deletedUser = await TwoFA.findByIdAndDelete(found2fa._id);
      if (!deletedUser)
        return {
          error: "Something went wrong",
          success: undefined,
          redirectUrl: undefined,
          isTwoFA: false,
        };
    }
    
    const result = await signIn("credentials", {
      email: lowercaseEmail,
      password,
      redirect: false,
    });
    if (!result || result.error) {
        return {
          error: "Login failed. Please try again.",
          success: undefined,
          redirectUrl: undefined,
          isTwoFA: false,
        };
      }

    return {
      success: "Login successful!",
      error: undefined,
      redirectUrl: redirect
        ? encodeURIComponent(redirect)
        : DEFAULT_LOGIN_REDIRECT,
      isTwoFA: false,
    };
  } catch (error) {
    console.error(`Errror while signing in: ${error}`);
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            error: "Invalid credentials",
            success: undefined,
            redirectUrl: undefined,
            isTwoFA: false,
          };
        default:
          return {
            error: "Something went wrong",
            success: undefined,
            redirectUrl: undefined,
            isTwoFA: false,
          };
      }
    } else {
      return {
        error: "Unexpected error occurred",
        success: undefined,
        redirectUrl: undefined,
        isTwoFA: false,
      };
    }
  }
};
