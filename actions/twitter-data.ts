"use server";
import { useGetSocialAuthState } from "@/hooks/use-get-social-auth-state";
import { useGetSocialMediaDetails } from "@/hooks/use-get-social-media-details";
import axios from "axios";
import { findOne } from "@/data/users-data";
import { getServerUser } from "@/hooks/get-server-user";
import { connectToDatabase } from "@/lib/db";
import type { ISocial } from "@/models/social-media-schema";
import { oauth } from "@/lib/oauth-twitter-client";
type UserData = {
  id: string;
  name: string;
  username: string;
};
export const twitterData = async () => {
  const session = await getServerUser();
  const socialAuthState = await useGetSocialAuthState("twitter");
  const socialMediaDetails = await useGetSocialMediaDetails("twitter");

  if (
    !session ||
    !socialMediaDetails ||
    socialAuthState === false ||
    !socialMediaDetails.accessToken ||
    !socialMediaDetails.refreshToken
  ) {
    return { error: "User not allowed to view this resource", data: undefined };
  }

  const url = "https://api.twitter.com/2/users/me";
  try {
    await connectToDatabase();
    const response: UserData = await new Promise<UserData>(
      (resolve, reject) => {
        oauth.get(
          url,
          socialMediaDetails.accessToken as string,
          socialMediaDetails.refreshToken as string,
          (error, data) => {
            if (error) {
              reject(error);
            } else if (typeof data === "string") {
              try {
                const parsedData = JSON.parse(data) as UserData;
                resolve(parsedData);
              } catch (err) {
                reject("Failed to parse user data");
              }
            } else {
              reject("Invalid data format received");
            }
          }
        );
      }
    );
    const user = await findOne({ email: session.email });
    if (!user) {
      return { error: "User not found", data: undefined };
    }
    const platform = user.socialMedia?.find(
      (app: ISocial) => app.name === "twitter"
    );
    if (!platform) {
      return { error: "Internal server error", data: undefined };
    }
    platform.userId = response.id;
    await user.save();
    const userDetailsUrl = `https://api.twitter.com/2/users/${response.id}?user.fields=profile_image_url,created_at,public_metrics,url`;
    const userDetailsResponse = await new Promise((resolve, reject) => {
      oauth.get(
        userDetailsUrl,
        socialMediaDetails.accessToken as string,
        socialMediaDetails.refreshToken as string,
        (error, data) => {
          if (error) {
            reject(error);
          } else {
            resolve(data);
          }
        }
      );
    });
    return { error: undefined, data: userDetailsResponse };
  } catch (error) {
    console.error("Error occurred while fetching Twitter data:", error);

    return {
      error: "Error occurred while fetching user data",
      data: undefined,
    };
  }
};
