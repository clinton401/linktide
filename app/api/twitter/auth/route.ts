import { CustomError } from "@/lib/custom-error-utils";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import TwitterOauthToken from "@/models/twitter-oauth-token-schema";
import { TwitterApi } from 'twitter-api-v2';
export async function GET() {
  const {TWITTER_API_KEY: CONSUMER_KEY, TWITTER_API_SECRET_KEY: CONSUMER_SECRET } = process.env;
  const REDIRECT_URI = process.env.TWITTER_REDIRECT_URI || "http://localhost:3000/api/twitter/callback";

  if(!CONSUMER_KEY || !CONSUMER_SECRET) {
    return NextResponse.json({ error: 'Api key and secret are not defined' }, { status: 500 });
  }

  try {
    await connectToDatabase();
    const client = new TwitterApi({ appKey: CONSUMER_KEY , appSecret: CONSUMER_SECRET });
    const authLink = await client.generateAuthLink(REDIRECT_URI, { linkMode: 'authorize' });
    const {oauth_token: oauthToken , oauth_token_secret: oauthTokenSecret } = authLink
    
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
 
    await TwitterOauthToken.findOneAndUpdate(
      { oauthToken },  
      { 
        oauthTokenSecret,   
        expiresAt, 
      },
      { 
        new: true,  
        upsert: true, 
      }
    );
   
    const authorizationUrl = authLink.url;
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
