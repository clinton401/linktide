import { CustomError } from "@/lib/custom-error-utils";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { oauth } from "@/lib/oauth-twitter-client";
import TwitterOauthToken from "@/models/twitter-oauth-token-schema";
export async function GET() {
  try {
    await connectToDatabase();
    const { oauthToken, oauthTokenSecret } = await new Promise<{
      oauthToken: string;
      oauthTokenSecret: string;
    }>((resolve, reject) => {
      oauth.getOAuthRequestToken((error, oauthToken, oauthTokenSecret) => {
        if (error) {
          reject(error);
        } else {
          resolve({ oauthToken, oauthTokenSecret });
        }
      });
    });

    await TwitterOauthToken.create({
      oauthToken,
      oauthTokenSecret,
    });
    const authorizationUrl = `https://api.twitter.com/oauth/authenticate?oauth_token=${oauthToken}`;
    return NextResponse.json({ redirectTo: authorizationUrl });
  } catch (error) {
    console.error("Error during Twitter sign-in:", error);
    if (error instanceof CustomError) {
      return NextResponse.json(
        { error: `Error during Twitter sign-in: ${error.message}` },
        { status: error.statusCode }
      );
    }

    return NextResponse.json(
      { error: "Error during Twitter sign-in:" },
      { status: 500 }
    );
  }
}
