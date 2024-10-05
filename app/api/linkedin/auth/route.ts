import { generateRandomState } from "@/lib/auth-utils";
import { CustomError } from "@/lib/custom-error-utils";
import { NextResponse } from "next/server";
import LinkedInAuthState from "@/models/linkedin-auth-state-schema";
import { connectToDatabase } from "@/lib/db";
export async function GET() {
  const { LINKEDIN_CLIENT_ID: CLIENT_ID } = process.env;
  const { state, expiresAt } = generateRandomState();
  const REDIRECT_URI = process.env.LINKEDIN_REDIRECT_URI || "http://localhost:3000/api/linkedin/callback";
  const authorizationUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
    REDIRECT_URI
  )}&state=${state}&scope=openid%20profile%20email%20w_member_social`;
  // const authorizationUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&state=${state}&scope=r_liteprofile%20r_emailaddress%20w_member_social`;
  
  if (!CLIENT_ID) {
    return NextResponse.json({ error: 'Client ID is not defined' }, { status: 500 });
  }
  try {
    await connectToDatabase();
    const newState = await LinkedInAuthState.create({
      state,
      expiresAt,
    });
    console.log(`New State: ${JSON.stringify(newState)}`);
    if(!newState) return NextResponse.json({ error: 'Unable to create Linkedin state' }, { status: 500 });
    
   
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
