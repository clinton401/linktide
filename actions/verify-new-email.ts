"use server";
import { findOne } from "@/data/users-data";
import { connectToDatabase } from "@/lib/db";
import NewEmail from "@/models/new-email-schema";
import { rateLimit } from "@/lib/rate-limit";
import getUserIpAddress from "@/hooks/get-user-ip-address";

export const verifyNewEmail = async (verificationCode: string) => {
  const userIp = await getUserIpAddress();
  const { error } = rateLimit(userIp, false);
  if (error) return {
    error,
    success: undefined,
    new_email: undefined
  };
  try {
    await connectToDatabase();
    const foundUser = await NewEmail.findOne({ verificationCode });

    if (!foundUser) {
      return {
        error: "Invalid verification link. Your email has not been changed.",
        success: undefined,
        new_email: undefined
      };
    }

    const expiresAtDate = foundUser.expiresAt ? new Date(foundUser.expiresAt) : null;
    const hasExpired = expiresAtDate && !isNaN(expiresAtDate.getTime())
      ? expiresAtDate < new Date()
      : false;

    if (hasExpired) {
      return {
        error: "The verification link has expired. Your email has not been changed.",
        success: undefined,
        new_email: undefined
      };
    }

    const user = await findOne({ email: foundUser.email });
    if (!user) {
      return {
        error: "User not found. Your email has not been changed.",
        success: undefined,
        new_email: undefined
      };
    }
    if(user.oauth.length > 0) return {
      error: "Email cannot be changed because you signed in with an OAuth provider",
      success: undefined,
      new_email: undefined
  }

    user.email = foundUser.newEmail; 
    await user.save();
    await NewEmail.findByIdAndDelete(foundUser._id);

    return {
      error: undefined,
      success: "Email changed successfully.",
      new_email: foundUser.newEmail
    };
  } catch (err) {
    console.error(`Error while changing user email: ${err}`);
   
    return {
      error: "An unknown error occurred, and Your email has not changed",
      success: undefined,
      new_email: undefined
    };
  }
};
