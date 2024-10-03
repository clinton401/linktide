"use server";

import { getSocialAuthState } from "@/hooks/get-social-auth-state";
import { getSocialMediaDetails } from "@/hooks/get-social-media-details";
import { getServerUser } from "@/hooks/get-server-user";
import {
  uploadTiktokVideoBuffer,
  initiateTiktokVideoUpload
} from "@/lib/create-post-utils";
import { isStillAuth } from "@/lib/auth-utils";

import { getNewTiktokAccessToken } from "@/lib/refresh-tokens";
type PostData = {
  postText: string;
  imagesArray: Buffer[];
  video: Buffer | undefined | null;
};

export const createTiktokPost = async (
  isVideoChosen: boolean,
  postData: PostData
): Promise<{
  error: string | undefined;
  success: undefined | string;
}> => {
  const { postText, imagesArray, video } = postData;
  const { TWITTER_API_KEY: CONSUMER_KEY, TWITTER_API_SECRET_KEY: CONSUMER_SECRET } = process.env;

  if (!CONSUMER_KEY || !CONSUMER_SECRET) {
    return { error: "API KEY and SECRET are required", success: undefined };
  }

  const session = await getServerUser();
  const tiktokAuthState = await getSocialAuthState("tiktok");
  const tiktokMediaDetails = await getSocialMediaDetails("tiktok");

  if (!session) {
    return { error: "User not allowed to view this resource", success: undefined };
  }

  const isNoPostData = postText.length < 1 && imagesArray.length < 1 && !video;

  if (isNoPostData) {
    return {
      error: "Please upload at least one text, video, or image to proceed.",
      success: undefined,
    };
  }

  try {
    if (!session ||
      !tiktokMediaDetails ||
      !session.email ||
      tiktokAuthState === false ||
      !tiktokMediaDetails.accessToken 
    ) {
      return {
        error: "You are not authorized to post. Please check your authentication on the platforms and try again",
        success: undefined,
      };
    }
    const authStatus = isStillAuth(tiktokMediaDetails);
  const {isAccessExpired, isRefreshExpired, refreshToken} = authStatus;
  let {accessToken } = authStatus;
  if(!accessToken) {
    return {error: "No Access Token", success: undefined }
  }
  if (isAccessExpired) {
    if (isRefreshExpired || !refreshToken) {
      return { error: "Expired Access Token", success: undefined };
    }
    // Refresh the access token
    const obtainedAccessToken = await getNewTiktokAccessToken(
      refreshToken,
      session.email
    );
    if (!obtainedAccessToken) {
      return { error: "Failed to refresh access token", success: undefined };
    }
    accessToken = obtainedAccessToken; // Use the new access token
  }

    // const client = new TwitterApi({
    //   appKey: CONSUMER_KEY,
    //   appSecret: CONSUMER_SECRET,
    //   accessToken: twitterMediaDetails.accessToken,
    //   accessSecret: twitterMediaDetails.refreshToken, // This should be the access secret, not refresh token
    // });

    // if (!video && imagesArray.length < 1) {
    //   if (postText.length < 2) {
    //     return {
    //       error: "Text must be 2 characters or more",
    //       success: undefined,
    //     };
    //   }
    //   await client.v2.tweet(postText);
    //   return {
    //     error: undefined,
    //     success: "Tweet sent successfully",
    //   };
    // }

    if (isVideoChosen && video) {
      const uploadDetails = await initiateTiktokVideoUpload(accessToken, video.length, postText);
 
     const {upload_url, publish_id} = uploadDetails;
     const finalUpload = await uploadTiktokVideoBuffer(upload_url, video);
    //  console.log(`Video posted successfully: ${JSON.stringify(finalUpload)}`);
      return {
        success: "Tiktok video posted successfully",
        error: undefined,
      };
    }

    // if (!isVideoChosen && imagesArray.length > 0) {
     
    //   return {
    //     success: "Tweet with image posted successfully",
    //     error: undefined,
    //   };
    // }

    return {
      error: "Please upload at least  video, or image to proceed.",
      success: undefined,
    };
  } catch (error) {
    console.log(`Tiktok error: ${error}`);
    return {
      error: "Unable to post to Tiktok, try again later",
      success: undefined,
    };
  }
};
