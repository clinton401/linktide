export const dynamic = "force-dynamic";

import { CustomError } from "@/lib/custom-error-utils";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
// import TwitterOauthToken from "@/models/twitter-oauth-token-schema";
import { TwitterApi } from "twitter-api-v2";
import TwitterAuth from "@/models/twitter-auth-schema";

export async function GET() {
  const { TWITTER_API_KEY, TWITTER_API_SECRET_KEY, TWITTER_REDIRECT_URI } =
    process.env;
  const REDIRECT_URI =
    TWITTER_REDIRECT_URI || "http://localhost:3000/api/twitter/callback";

  if (!TWITTER_API_KEY || !TWITTER_API_SECRET_KEY) {
    return NextResponse.json(
      { error: "Twitter client ID and secret are not defined" },
      { status: 500 }
    );
  }

  try {
    await connectToDatabase();
    const client = new TwitterApi({ appKey: TWITTER_API_KEY, appSecret: TWITTER_API_SECRET_KEY });
    const { url, oauth_token, oauth_token_secret } = await client.generateAuthLink(REDIRECT_URI, {
      linkMode: 'authorize', 
    });
    await TwitterAuth.create({
      oauthToken: oauth_token,
      oauthTokenSecret: oauth_token_secret,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      });
    return NextResponse.json({ redirectTo: url });
    // const twitterClient = new TwitterApi({
    //   clientId: TWITTER_CLIENT_ID,
    //   clientSecret: TWITTER_CLIENT_SECRET,
    // });

    // const { url, codeVerifier, state } = twitterClient.generateOAuth2AuthLink(
    //   REDIRECT_URI,
    //   {
    //     scope: [
    //       "tweet.read",
    //       "tweet.write",
    //     //   "media.read",
    //       "media.write",
    //       "offline.access",
    //       "users.read"
    //     ],
    //   }
    // );
    

    // await TwitterAuth.create({
    //   codeVerifier,
    //   state,
    //   expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    // });
    

    // return NextResponse.json({ redirectTo: url });
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
