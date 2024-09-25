"use server";
import { getSocialAuthState } from "@/hooks/get-social-auth-state";
import { getSocialMediaDetails } from "@/hooks/get-social-media-details";
import axios from "axios";
import { findOne } from "@/data/users-data";
import { getServerUser } from "@/hooks/get-server-user";
import { connectToDatabase } from "@/lib/db";
import type { ISocial } from "@/models/social-media-schema";
type UserData = {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
  email?: string;
  email_verified?: boolean;
};

export const linkedinData = async (): Promise<{
  data: UserData | undefined;
  error: string | undefined;
}> => {
  const session = await getServerUser();
  const socialAuthState = await getSocialAuthState("linkedin");
  const socialMediaDetails = await getSocialMediaDetails("linkedin");

  if (
    !session ||
    !socialMediaDetails ||
    socialAuthState === false ||
    !socialMediaDetails.accessToken
  ) {
    return { error: "User not allowed to view this resource", data: undefined };
  }

  //   const url = "https://api.linkedin.com/v2/me";
  const url = "https://api.linkedin.com/v2/userinfo";
  try {
    await connectToDatabase();
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${socialMediaDetails.accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status >= 200 && response.status < 300) {
      const data: UserData = response.data;
      const user = await findOne({ email: session.email});
      if (!user) {
        return { error: "User not found", data: undefined };
      }
      const platform = user.socialMedia?.find((app: ISocial) => app.name === "linkedin");
      if (!platform) {
        return { error: "Internal server error", data: undefined };
      }
      platform.userId = data.sub;
      await user.save();
      return { error: undefined, data };
    } else {
      return {
        error: `Error occurred: ${response.statusText}`,
        data: undefined,
      };
    }
  } catch (error) {
    console.error("Error occurred while fetching LinkedIn data:", error);

    return {
      error: "Error occurred while fetching user data",
      data: undefined,
    };
  }
};
