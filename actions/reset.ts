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
export const reset = async (
  values: z.infer<ReturnType<typeof ResetSchema>>,
  isCodeSent: boolean
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

  const { email, otp, newPassword } = validatedFields.data;
  await connectToDatabase();
  const { verificationCode, expiresAt } = otpGenerator();
try{


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
          <p>We received a request to reset your password. Please use the following One-Time Password (OTP) to complete the process:</p>
          <div class="otp">${verificationCode}</div>
          <p><strong>Note:</strong> This OTP is valid for one hour. If you did not request a password reset, please ignore this email.</p>
          <p>If you have any questions, feel free to reach out to our support team.</p>
          <p>Best regards,<br> The Linktide Team</p>
        </div>
        <div class="footer">
          <p>&copy; ${currentYear} Linktide. All rights reserved.</p>
        </div>
      </div>
    </body>
    
    </html>`;
    

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

  const isPasswordTheSameAsLastOne = foundUser?.password ? await validatePassword(newPassword, foundUser.password): false;
  if(isPasswordTheSameAsLastOne) return {
    error: "New password cannot be the same as the current one",
    success: undefined,
    redirectUrl: undefined,
    isOtpSent: false
  };
  foundUser.password = newPassword;
  await foundUser.save();
  const deletedUser = await ResetPassword.findOneAndDelete({ userEmail: lowerCaseEmail });
  if(!deletedUser) return {
    error: "User not found. Check email and try again",
    success: undefined,
    redirectUrl: undefined,
    isOtpSent: false
  };
  return {
    success: "Password changed successfully",
    error: undefined,
    redirectUrl: "/auth/login",
    isOtpSent: false
  };
} catch(err) {
    console.error(`error while resetting password: ${err}`)
    if (err instanceof Error) {
        return {
          error: err.message,
          success: undefined,
          redirectUrl: undefined,
          isOtpSent: false
        };
      }
      return {
        error: "An unknown error occurred.",
        success: undefined,
        redirectUrl: undefined,
        isOtpSent: false
      };
}
};
