"use server";
import * as z from "zod";
import { findOne } from "@/data/users-data";
import { getServerUser } from "@/hooks/get-server-user";
import { connectToDatabase } from "@/lib/db";
import { ProfileEditSchema } from "@/schemas";
import { generateNewEmailVerificationHtml } from "@/lib/mail-html-template";
import { idGenerator } from "@/lib/auth-utils";
import NewEmail from "@/models/new-email-schema";
import { rateLimit } from "@/lib/rate-limit";

import { sendEmail } from "@/lib/mail";
export const editProfile = async (
  values: z.infer<typeof ProfileEditSchema>
) => {
  const session = await getServerUser();
  if (!session) {
    return {
      error: "User not authorized",
      success: undefined,
      redirectUrl: "/auth/login",
    };
  }

  const { error } = rateLimit(session.id, true);
  if(error){
    return {
      error,
      success: undefined,
      redirectUrl: undefined,
    };
  }
  const validatedFields = ProfileEditSchema.safeParse(values);
  if (!validatedFields.success) {
    return {
      error: "Invalid fields",
      success: undefined,
      redirectUrl: undefined,
    };
  }
  const { name, email } = validatedFields.data;

  if (!name && !email)
    return {
      error: "At least one of 'name' or 'email' must be provided",
      success: undefined,
      redirectUrl: undefined,
    };
  try {
    await connectToDatabase();
    const user = await findOne({ email: session.email });
    if (!user)
      return {
        error: "User not found",
        success: undefined,
        redirectUrl: undefined,
      };
    if (email) {
      if (user.oauth.length > 0)
        return {
          error:
            "Email cannot be changed because you signed in with an OAuth provider",
          success: undefined,
        };
      const foundUser = await findOne({ email: email.toLowerCase() });
      if (foundUser)
        return {
          error: "The email address is already registered.",
          success: undefined,
          redirectUrl: undefined,
        };
      const { verificationCode, expiresAt } = idGenerator();
      const currentYear = new Date().getFullYear();
      const verificationLink = `${process.env.DOMAIN_URL}/new-email-verification/${verificationCode}`;
      const subject = "Please verify your email";
      const text = `Thank you for updating your email with us. Your verification link is: ${verificationLink}. This link will expire in 1 hour. If you did not request this change, please ignore this message or contact support.`;
      const html = generateNewEmailVerificationHtml(
        verificationLink,
        currentYear
      );
      await sendEmail(email, subject, text, html);
      await NewEmail.create({
        newEmail: email,
        email: user.email,
        verificationCode,
        expiresAt,
      });
    }
    if (name) {
      user.name = name;
      await user.save();
    }
    return {
      error: undefined,
      success: `User details have been successfully updated. ${
        email
          ? "A verification link has been sent to your email to confirm the new address."
          : ""
      } `,
      redirectUrl: undefined,
    };
  } catch (err) {
    console.error(`error while editing profile details: ${err}`);
    
    return {
      error: "An unknown error occurred.",
      success: undefined,
      redirectUrl: undefined,
    };
  }
};
