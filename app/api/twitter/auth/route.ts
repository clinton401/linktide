export const dynamic = 'force-dynamic';

import { CustomError } from "@/lib/custom-error-utils";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import TwitterOauthToken from "@/models/twitter-oauth-token-schema";
import { TwitterApi } from 'twitter-api-v2';

export async function GET() {
  const { TWITTER_CLIENT_ID, TWITTER_CLIENT_SECRET, TWITTER_REDIRECT_URI } = process.env;
  const REDIRECT_URI = TWITTER_REDIRECT_URI || "http://localhost:3000/api/twitter/callback";

  // Check for missing credentials
  if (!TWITTER_CLIENT_ID || !TWITTER_CLIENT_SECRET) {
    return NextResponse.json({ error: 'Twitter client ID and secret are not defined' }, { status: 500 });
  }

  try {
    // Connect to the database if needed
    await connectToDatabase();

    // Initialize Twitter API client for OAuth2
    const twitterClient = new TwitterApi({
      clientId: TWITTER_CLIENT_ID,
      clientSecret: TWITTER_CLIENT_SECRET
    });

    // Generate OAuth 2.0 authorization link
    const { url, codeVerifier, state } = twitterClient.generateOAuth2AuthLink(
      REDIRECT_URI,
      { scope: ['tweet.read', 'tweet.write', 'users.read', 'offline.access'] } // Adjust scopes as needed
    );

    await TwitterOauthToken.create({ codeVerifier, state, expiresAt: new Date(Date.now() + 15 * 60 * 1000) });

   
    return NextResponse.json({ redirectTo: url });
  } catch (error) {
    console.error("Error during Twitter OAuth 2.0 sign-in:", error);

    if (error instanceof CustomError) {
      return NextResponse.json(
        { error: `Error during Twitter sign-in: ${error.message}` },
        { status: error.statusCode }
      );
    }

    return NextResponse.json(
      { error: "Error during Twitter sign-in" },
      { status: 500 }
    );
  }
}
