"use server";

import { getSocialAuthState } from "@/hooks/get-social-auth-state";
import { getSocialMediaDetails } from "@/hooks/get-social-media-details";
import { getServerUser } from "@/hooks/get-server-user";
import {
  uploadTwitterVideo,
  uploadTwitterMultipleMedia,
} from "@/lib/create-post-utils";
// import { isStillAuth } from "@/lib/auth-utils";
import { TwitterApi } from "twitter-api-v2";

// import { refreshTwitterAccessToken } from "@/lib/refresh-tokens";
type PostData = {
  postText: string;
  imagesArray: Buffer[];
  video: Buffer | undefined | null;
};

export const createTwitterPost = async (
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
  const twitterAuthState = await getSocialAuthState("twitter");
  const twitterMediaDetails = await getSocialMediaDetails("twitter");

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
    if (!session.email || 
      !twitterMediaDetails ||
      twitterAuthState === false ||
      !twitterMediaDetails.accessToken ||
      !twitterMediaDetails.refreshToken
    ) {
      return {
        error: "You are not authorized to post. Please check your authentication on the platforms and try again",
        success: undefined,
      };
    }
   
     const client = new TwitterApi({
      appKey: CONSUMER_KEY,
      appSecret: CONSUMER_SECRET,
      accessToken: twitterMediaDetails.accessToken,
      accessSecret: twitterMediaDetails.refreshToken, 
    });

    if (!video && imagesArray.length < 1) {
      if (postText.length < 2) {
        return {
          error: "Text must be 2 characters or more",
          success: undefined,
        };
      }
      
      await client.v2.tweet(postText);
      return {
        error: undefined,
        success: "Tweet sent successfully",
      };
    }

    if (isVideoChosen && video) {
      const mediaId = await uploadTwitterVideo(video);
      const tweet = await client.v2.tweet(postText, {
        media: {
          media_ids: [mediaId], // Wrap the mediaId in an array
        },
      });

      // console.log('Tweet with video posted successfully:', tweet);
      return {
        success: "Tweet with video posted successfully",
        error: undefined,
      };
    }

    if (!isVideoChosen && imagesArray.length > 0) {
      const mediaIds = await uploadTwitterMultipleMedia(imagesArray);
      const limitedMediaIds = mediaIds.slice(0, 4) as [string] | [string, string] | [string, string, string] | [string, string, string, string];
      const tweet = await client.v2.tweet(postText, {
        media: {
          media_ids: limitedMediaIds // Correct usage of media parameter
        }
      });

      // console.log('Tweet with image posted successfully:', tweet);
      return {
        success: "Tweet with image posted successfully",
        error: undefined,
      };
    }

    return {
      error: "Please upload at least one text, video, or image to proceed.",
      success: undefined,
    };
  } catch (error) {
    console.log(`Twitter error: ${error}`);
    return {
      error: "Unable to post to Twitter, try again later",
      success: undefined,
    };
  }
};
