export const dynamic = 'force-dynamic';
import { NextResponse, NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/db";
import axios from "axios";
import { getServerUser } from "@/hooks/get-server-user";
import { findOne } from "@/data/users-data";
import type { ISocial } from "@/models/social-media-schema";
import TwitterOauthToken from "@/models/twitter-auth-schema";
import { TwitterApi } from 'twitter-api-v2';

export async function GET(request: NextRequest) {
  const { TWITTER_API_KEY, TWITTER_API_SECRET_KEY, TWITTER_REDIRECT_URI } = process.env;

  const url = new URL(request.url);
  const oauth_token = url.searchParams.get("oauth_token");
  const oauth_verifier = url.searchParams.get("oauth_verifier");

  if (!TWITTER_API_KEY || !TWITTER_API_SECRET_KEY || !TWITTER_REDIRECT_URI) {
    return NextResponse.redirect(
      new URL(`/analytics/twitter?error=${encodeURIComponent("API key and secret are required")}`, request.url)
    );
  }

  if (!oauth_token || !oauth_verifier) {
    return NextResponse.redirect(
      new URL(`/analytics/twitter?error=${encodeURIComponent("Invalid callback parameters")}`, request.url)
    );
  }

  try {
    await connectToDatabase();

    const tokenRecord = await TwitterOauthToken.findOne({ oauthToken: oauth_token, expiresAt: { $gte: new Date() } });
    if (!tokenRecord) {
      return NextResponse.redirect(
        new URL(`/analytics/twitter?error=${encodeURIComponent("Invalid or expired session token")}`, request.url)
      );
    }
    const { oauthTokenSecret } = tokenRecord;

    const client = new TwitterApi({
      appKey: TWITTER_API_KEY!,
      appSecret: TWITTER_API_SECRET_KEY!,
      accessToken: oauth_token!,
      accessSecret: oauthTokenSecret!,
    });

    const { client: loggedClient, accessToken, accessSecret } = await client.login(oauth_verifier!);
    const userInfo = await loggedClient.v2.me();
    
    // Ensure userInfo is retrieved successfully
    if (!userInfo || !userInfo.data) {
      return NextResponse.redirect(
        new URL(`/analytics/twitter?error=${encodeURIComponent("Failed to fetch user information")}`, request.url)
      );
    }

    const userId = userInfo.data.id;
    const expiresAt = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000); // 60 days expiration

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

    // Update user social media information
    const platform = user.socialMedia?.find((app: ISocial) => app.name === "twitter");
    if (platform) {
      platform.accessToken = accessToken;
      platform.expiresAt = expiresAt;
      platform.refreshToken  = accessSecret; // Store the access secret
      platform.userId = userId;
      platform.refreshTokenExpiresAt = expiresAt
    } else {
      user.socialMedia?.push({
        name: "twitter",
        accessToken,
        expiresAt,
        refreshToken: accessSecret, // Store the access secret
        userId,
        refreshTokenExpiresAt: expiresAt
      });
    }

    await TwitterOauthToken.findOneAndDelete({ oauthToken: oauth_token });

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
