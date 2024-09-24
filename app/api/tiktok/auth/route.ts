import { generateRandomState, codeChallenge } from "@/lib/auth-utils";
import { CustomError } from "@/lib/custom-error-utils";
import { NextResponse } from "next/server";
import AuthState from "@/models/auth-state-schema";
import { connectToDatabase } from "@/lib/db";
export async function GET() {
  const { TIKTOK_CLIENT_ID: CLIENT_ID } = process.env;
  const { state, expiresAt } = generateRandomState();
  const REDIRECT_URI = process.env.TIKTOK_REDIRECT_URI || "http://localhost:3000/api/tiktok/callback";
  if (!CLIENT_ID) {
    return NextResponse.json({ error: 'Client ID is not defined' }, { status: 500 });
  }
  if (!REDIRECT_URI) {
    return NextResponse.json({ error: 'Redirect URI is not defined' }, { status: 500 });
  }
  const authorizationUrl = `https://www.tiktok.com/v2/auth/authorize/?client_key=${encodeURIComponent(CLIENT_ID)}&response_type=code&scope=user.info.profile,user.info.basic,user.info.stats,video.upload&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&state=${state}&code_challenge=${codeChallenge}&code_challenge_method=S256`;
  
  
 
  try {
    await connectToDatabase();
    await AuthState.findOneAndUpdate(
      { state },  
      {   
        expiresAt, 
      },
      { 
        new: true,  
        upsert: true, 
      }
    );
   
    return NextResponse.json({redirectTo: authorizationUrl});
  } catch (error) {
    console.error(error);
    if (error instanceof CustomError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
