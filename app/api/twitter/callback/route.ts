import { NextResponse, NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/db";
import axios from "axios";
import { getServerUser } from "@/hooks/get-server-user";
import { findOne } from "@/data/users-data";
import type { ISocial } from "@/models/social-media-schema";
import TwitterOauthToken from "@/models/twitter-oauth-token-schema";
import { TwitterApi } from 'twitter-api-v2';

export async function GET(request: NextRequest) {
  const { TWITTER_CLIENT_ID, TWITTER_CLIENT_SECRET, TWITTER_REDIRECT_URI } = process.env;

  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");


  if (!TWITTER_CLIENT_ID || !TWITTER_CLIENT_SECRET) {
    return NextResponse.redirect(
      new URL(`/analytics/linkedin?error=${encodeURIComponent("Client ID and secret are required")}`, request.url)
    );
  }
  if (!code || !state) {
    return NextResponse.redirect(
      new URL(`/analytics/twitter?error=${encodeURIComponent("Invalid callback parameters")}`, request.url)
    );
  }

  try {
    await connectToDatabase();

    const tokenRecord = await TwitterOauthToken.findOne({ state, expiresAt: { $gte: new Date() } });
    if (!tokenRecord) {
      return NextResponse.redirect(
        new URL(`/analytics/twitter?error=${encodeURIComponent("Invalid or expired session state")}`, request.url)
      );
    }

    const { codeVerifier } = tokenRecord;

    const twitterClient = new TwitterApi({
      clientId: TWITTER_CLIENT_ID!,
      clientSecret: TWITTER_CLIENT_SECRET!,
    });

    const { accessToken, refreshToken, expiresIn } = await twitterClient.loginWithOAuth2({
      code,
      codeVerifier,
      redirectUri: TWITTER_REDIRECT_URI!,
    });

    const { client: loggedClient } = await twitterClient.refreshOAuth2Token(refreshToken!); 
    const userInfo = await loggedClient.v2.me();
    const userId = userInfo.data.id;

    const expiresAt = Date.now() + expiresIn * 1000; 
    const refreshTokenExpiresAt = expiresAt; 

   
    const session = await getServerUser();
    if (!session || !session.email) {
      return NextResponse.redirect(new URL("/analytics/login", request.url));
    }

    const user = await findOne({
      email: session.email.toLowerCase(),
    });
    if (!user) {
      return NextResponse.redirect(
        new URL(`/analytics/twitter?error=${encodeURIComponent("Unable to find user")}`, request.url)
      );
    }

    // Store accessToken, refreshToken, and userId for the Twitter account in the user's profile
    const platform = user.socialMedia?.find((app: ISocial) => app.name === "twitter");
    if (platform) {
      platform.accessToken = accessToken;
      platform.expiresAt = expiresAt;
      platform.refreshToken = refreshToken;
      platform.refreshTokenExpiresAt = refreshTokenExpiresAt;
      platform.userId = userId;
    } else {
      user.socialMedia?.push({
        name: "twitter",
        accessToken,
        expiresAt,
        refreshToken,
        refreshTokenExpiresAt,
        userId,
      });
    }


    await TwitterOauthToken.findOneAndDelete({ state });

    await user.save();

    // Redirect to the Twitter analytics page
    return NextResponse.redirect(new URL("/analytics/twitter", request.url));
  } catch (error) {
    console.error(error);

    // Handle Axios errors if they occur during API calls
    if (axios.isAxiosError(error) && error.response) {
      return NextResponse.redirect(
        new URL(
          `/analytics/twitter?error=${encodeURIComponent(
            error.response.data.error_description || "Internal Server Error"
          )}`,
          request.url
        )
      );
    } else {
      // Handle other types of errors
      return NextResponse.redirect(
        new URL(`/analytics/twitter?error=${encodeURIComponent("Internal Server Error")}`, request.url)
      );
    }
  }
}
