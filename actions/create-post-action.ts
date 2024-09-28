"use server";
import { getSocialAuthState } from "@/hooks/get-social-auth-state";
import { getSocialMediaDetails } from "@/hooks/get-social-media-details";
// import axios from "axios";
// import { findOne } from "@/data/users-data";
import { getServerUser } from "@/hooks/get-server-user";
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";
import {
  uploadAllLinkedinMedia,
  createLinkedinMediaPost,
  createLinkedinTextPost,
} from "@/lib/create-post-utils";
type Checked = DropdownMenuCheckboxItemProps["checked"];
type PostData = {
  postText: string;
  imagesArray: File[];
  video: File | undefined;
  showTiktok: Checked | undefined;
  showLinkedin: Checked | undefined;
  showTwitter: Checked | undefined;
  showFacebook: Checked | undefined;
  showInstagram: Checked | undefined;
};
export const createPostAction = async (
  isVideoChosen: boolean,
  postData: PostData
): Promise< {
    error: string | undefined;
    success: undefined | string;
} > => {
  const {
    postText,
    imagesArray,
    video,
    showTiktok,
    showLinkedin,
    showTwitter,
    showFacebook,
    showInstagram,
  } = postData;
  const session = await getServerUser();
  const linkedinAuthState = await getSocialAuthState("linkedin");
  const linkedinMediaDetails = await getSocialMediaDetails("linkedin");

  if (!session) {
    return { error: "User not allowed to view this resource", success: undefined };
  }
  const successRequest = {
    tiktok: false,
    linkedin: false,
    twitter: false,
  };
  const isNoPostData = postText.length < 1 && imagesArray.length < 1 && !video;
  const isNoPlatformChosen =
    !showTiktok &&
    !showLinkedin &&
    !showTwitter &&
    !showFacebook &&
    !showInstagram;
  if (isNoPostData)
    return {
      error: "Please upload at least one text, video, or image to proceed.",
      success: undefined,
    };
  if (isNoPlatformChosen)
    return {
      error: "Please select at least one social media platform to continue.",
      success: undefined,
    };
  try {
    if (showLinkedin) {
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
          uploadUrl
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
    } 
    return {
       
            error: "No platform chosen",
            success: undefined,
          
    }
  } catch (error) {
    console.log(`Linkedin error: ${error}`);
    return {
      error: "Unable to post to linkedin, try again later",
      success: undefined,
    };
  }
};
