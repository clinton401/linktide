// app/api/create-post/route.ts
import { NextResponse } from "next/server";
import { getSocialAuthState } from "@/hooks/get-social-auth-state";
import { getSocialMediaDetails } from "@/hooks/get-social-media-details";
import { getServerUser } from "@/hooks/get-server-user";
import {
  uploadAllLinkedinMedia,
  createLinkedinMediaPost,
  createLinkedinTextPost,
} from "@/lib/create-post-utils";

export async function POST(req: Request) {
  try {
    const { isVideoChosen, postData } = await req.json();

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
      return NextResponse.json(
        { error: "User not allowed to view this resource" },
        { status: 403 }
      );
    }

    const isNoPostData = postText.length < 1 && imagesArray.length < 1 && !video;
    const isNoPlatformChosen =
      !showTiktok &&
      !showLinkedin &&
      !showTwitter &&
      !showFacebook &&
      !showInstagram;

    if (isNoPostData) {
      return NextResponse.json(
        { error: "Please upload at least one text, video, or image to proceed." },
        { status: 400 }
      );
    }

    if (isNoPlatformChosen) {
      return NextResponse.json(
        { error: "Please select at least one social media platform to continue." },
        { status: 400 }
      );
    }

    if (showLinkedin) {
      if (
        !linkedinMediaDetails ||
        linkedinAuthState === false ||
        !linkedinMediaDetails.accessToken ||
        !linkedinMediaDetails.userId
      ) {
        return NextResponse.json(
          { error: "You are not authorized to post. Please check your authentication on the platforms and try again." },
          { status: 401 }
        );
      }

      // Handle text post
      if (!video && imagesArray.length < 1) {
        const response = await createLinkedinTextPost(
          linkedinMediaDetails.accessToken,
          linkedinMediaDetails.userId,
          postText
        );

        if (!response) {
          return NextResponse.json(
            { error: "Unable to post to LinkedIn, try again later." },
            { status: 500 }
          );
        }

        return NextResponse.json({ success: "Post sent successfully" });
      }

      // Handle media post
      const uploadUrl = await uploadAllLinkedinMedia(
        linkedinMediaDetails.accessToken,
        linkedinMediaDetails.userId,
        imagesArray,
        video,
        isVideoChosen
      );

      if (!uploadUrl) {
        return NextResponse.json(
          { error: "Unable to post to LinkedIn, try again later." },
          { status: 500 }
        );
      }

      const response = await createLinkedinMediaPost(
        linkedinMediaDetails.accessToken,
        linkedinMediaDetails.userId,
        postText,
        uploadUrl
      );
console.log(response)
      if (!response) {
        return NextResponse.json(
          { error: "Unable to post to LinkedIn, try again later." },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: "Post sent successfully" });
    }

    return NextResponse.json(
      { error: "No platform chosen" },
      { status: 400 }
    );
  } catch (error) {
    console.error(`LinkedIn error: ${error}`);
    return NextResponse.json(
      { error: "Unable to post to LinkedIn, try again later." },
      { status: 500 }
    );
  }
}
