"use server";
import { getSocialAuthState } from "@/hooks/get-social-auth-state";
import { getSocialMediaDetails } from "@/hooks/get-social-media-details";
import { getServerUser } from "@/hooks/get-server-user";
import {
  uploadAllLinkedinMedia,
  createLinkedinMediaPost,
  createLinkedinTextPost,
} from "@/lib/create-post-utils";
type PostData = {
  postText: string;
  imagesArray: Buffer[];
  video: Buffer | null | undefined;
};
export const createLinkedinPost = async (
  isVideoChosen: boolean,
  postData: PostData
): Promise< {
    error: string | undefined;
    success: undefined | string;
} > => {
  const {
    postText,
    imagesArray,
    video
  } = postData;
  const session = await getServerUser();
  const linkedinAuthState = await getSocialAuthState("linkedin");
  const linkedinMediaDetails = await getSocialMediaDetails("linkedin");

  if (!session) {
    return { error: "User not allowed to view this resource", success: undefined };
  }
  
  const isNoPostData = postText.length < 1 && imagesArray.length < 1 && !video;
 
  if (isNoPostData)
    return {
      error: "Please upload at least one text, video, or image to proceed.",
      success: undefined,
    };
 
  try {
      if (
        !linkedinMediaDetails ||
        linkedinAuthState === false ||
        !linkedinMediaDetails.accessToken ||
        !linkedinMediaDetails.userId
      ) {
        return {
          error:
            "You are not authorized to post. Please check your authentication on the platforms and try again",
          success: undefined,
        };
      }
      if (!video && imagesArray.length < 1) {
        if(postText.length < 2) return {
          error: "Text must be 2 characters or more",
          success: undefined
      }
        const response = await createLinkedinTextPost(
          linkedinMediaDetails.accessToken,
          linkedinMediaDetails.userId,
          postText
        );
        if (!response) {
          return {
            error: "Unable to post to linkedin, try again later",
            success: undefined,
          };
        }
        return {
          error: undefined,
          success: "Post sent successfully",
        };
      } else {
        const uploadUrl = await uploadAllLinkedinMedia(
          linkedinMediaDetails.accessToken,
          linkedinMediaDetails.userId,
          imagesArray,
          video,
          isVideoChosen
        );
        if (!uploadUrl) {
          return {
            error: "Unable to post to linkedin, try again later",
            success: undefined,
          };
        }
        const response = await createLinkedinMediaPost(
          linkedinMediaDetails.accessToken,
          linkedinMediaDetails.userId,
          postText,
          uploadUrl,
          isVideoChosen
        );
        if (!response) {
          return {
            error: "Unable to post to linkedin, try again later",
            success: undefined,
          };
        }
        return {
          error: undefined,
          success: "Post sent successfully",
        };
      }
    
  } catch (error) {
    console.log(`Linkedin error: ${error}`);
    return {
      error: "Unable to post to linkedin, try again later",
      success: undefined,
    };
  }
};
