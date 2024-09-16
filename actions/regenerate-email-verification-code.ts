"use server";
import { findById } from "@/data/users-data";
import { Types } from "mongoose";
import { connectToDatabase } from "@/lib/db";
import { otpGenerator } from "@/lib/auth-utils";

import { sendEmail } from "@/lib/mail";
export const regenerateEmailVerificationCode = async (userId: string) => {
  if (!userId || !Types.ObjectId.isValid(userId)) {
    return {
      error: "Invalid code",
      success: undefined,
      redirectUrl: undefined,
    };
  }
  const validId = new Types.ObjectId(userId);
  await connectToDatabase();
  const { verificationCode, expiresAt } = otpGenerator();
  try {
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
        redirectUrl: "/auth/login",
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
    const html = `<!DOCTYPE html>
      <html lang="en">
      
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your OTP Code</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            color: #333333;
          }
      
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 10px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            overflow: hidden;
          }
      
          .header {
            background-color: hsl(262.1 83.3% 57.8%);
            color: #ffffff;
            padding: 20px;
            text-align: center;
            font-size: 24px;
          }
      
          .content {
            padding: 30px;
          }
      
          .content p {
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 20px;
          }
      
          .otp {
            display: inline-block;
            font-size: 28px;
            color: hsl(262.1 83.3% 57.8%);
            font-weight: bold;
            letter-spacing: 4px;
            background-color: #f0f0f0;
            padding: 15px 25px;
            border-radius: 5px;
            margin-bottom: 20px;
          }
      
          .footer {
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #777777;
            background-color: #f9f9f9;
          }
      
          .footer p {
            margin: 0;
          }
      
          .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #4CAF50;
            color: #ffffff;
            border-radius: 5px;
            text-decoration: none;
            font-weight: bold;
          }
      
          @media only screen and (max-width: 600px) {
            .container {
              padding: 20px;
              width: 100%;
            }
      
            .content {
              padding: 20px;
            }
      
            .otp {
              font-size: 24px;
            }
          }
        </style>
      </head>
      
      <body>
        <div class="container">
          <div class="header">
            Your OTP Code
          </div>
          <div class="content">
            <p>Dear User,</p>
            <p>We received a request to verify your email address. Please use the following One-Time Password (OTP) to complete the process:</p>
            <div class="otp">${verificationCode}</div>
            <p><strong>Note:</strong> This OTP is valid for one hour. If you did not request this, please ignore this email.</p>
            <p>If you have any questions, feel free to reach out to our support team.</p>
            <p>Best regards,<br> The Linktide Team</p>
          </div>
          <div class="footer">
            <p>&copy; ${currentYear} Linktide. All rights reserved.</p>
          </div>
        </div>
      </body>
      
      </html>`;
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
