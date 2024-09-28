"use server";
import { getSocialAuthState } from "@/hooks/get-social-auth-state";
import { getSocialMediaDetails } from "@/hooks/get-social-media-details";
import axios from "axios";
import { getServerUser } from "@/hooks/get-server-user";
import { getNewTiktokAccessToken } from "@/lib/refresh-tokens";
import { isStillAuth } from "@/lib/auth-utils";
type UserProfile = {
      avatar_url: string;
      display_name: string;
      following_count: number;
      profile_deep_link: string;
      username: string;
      bio_description: string;
      follower_count: number;
      is_verified: boolean;
      likes_count: number;
      video_count: number;
    
  };
export const tiktokData = async (): Promise<{
    data: UserProfile | undefined;
    error: string | undefined;
  }> => {
  const session = await getServerUser();
  const socialAuthState = await getSocialAuthState("tiktok");
  const socialMediaDetails = await getSocialMediaDetails("tiktok");

  if (
    !session ||
    !socialMediaDetails ||
    !session.email ||
    socialAuthState === false ||
    !socialMediaDetails.accessToken
  ) {
    return { error: "User not allowed to view this resource", data: undefined };
  }

  
  const authStatus = isStillAuth(socialMediaDetails);
  const {isAccessExpired, isRefreshExpired, refreshToken} = authStatus;
  let {accessToken } = authStatus;

  if (isAccessExpired) {
    if (isRefreshExpired || !refreshToken) {
      return { error: "Expired Access Token", data: undefined };
    }
    // Refresh the access token
    const obtainedAccessToken = await getNewTiktokAccessToken(
      refreshToken,
      session.email
    );
    if (!obtainedAccessToken) {
      return { error: "Failed to refresh access token", data: undefined };
    }
    accessToken = obtainedAccessToken; // Use the new access token
  }

  const url = "https://open.tiktokapis.com/v2/user/info/";
  try {
    const response = await axios.get('https://open.tiktokapis.com/v2/user/info/', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
            fields: 'display_name,bio_description,avatar_url,is_verified,follower_count,following_count,video_count,likes_count,username,profile_deep_link', 
        },
      });
    const data = response.data?.data?.user;
    return { data: data, error: undefined };
  } catch (error) {
    console.error("Error occurred while fetching TikTok data:", error);
    return {
      error: "Error occurred while fetching user data",
      data: undefined,
    };
  }
};
