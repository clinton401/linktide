// export const dynamic = 'force-dynamic';
import { NextResponse, NextRequest } from "next/server";
// import AuthState from "@/models/auth-state-schema";

import LinkedInAuthState from "@/models/linkedin-auth-state-schema";
import { connectToDatabase } from "@/lib/db";
import axios from "axios";
import { getServerUser } from "@/hooks/get-server-user";
import { findOne } from "@/data/users-data";
import type { ISocial } from "@/models/social-media-schema";

export async function GET(request: NextRequest) {
  const {
    LINKEDIN_CLIENT_ID: CLIENT_ID,
    LINKEDIN_CLIENT_SECRET: CLIENT_SECRET,
  } = process.env;
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");
  const REDIRECT_URI = process.env.LINKEDIN_REDIRECT_URI || "http://localhost:3000/api/linkedin/callback";
  const authorizationUrl = `https://www.linkedin.com/oauth/v2/accessToken`;
console.log(`Auth code: ${code}`)
console.log(`Auth state from linkedin: ${state}`)
  if (!CLIENT_ID || !CLIENT_SECRET ) {
    return NextResponse.redirect(
      new URL(`/analytics/linkedin?error=${encodeURIComponent("CLIENT ID and SECRET are required")}`, request.url)
    );
  }
  if (error || !code || !state) {
    return NextResponse.redirect(
      new URL(`/analytics/linkedin?error=Code or state parameter missing`, request.url)
    );
  }

  try {
    await connectToDatabase();

    const authState = await LinkedInAuthState.findOne({
      state,
      expiresAt: { $gte: new Date() },
    });
    console.log(`Auth state: ${JSON.stringify(authState)}`)
    if (!authState) {
      return NextResponse.redirect(
        new URL(`/analytics/linkedin?error=Invalid or expired state`, request.url)
      );
    }

   

    const params = new URLSearchParams({
      grant_type: "authorization_code",
      code: code as string,
      redirect_uri: REDIRECT_URI as string,
      client_id: CLIENT_ID as string,
      client_secret: CLIENT_SECRET as string,
    });
    const tokenResponse = await axios.post(
      authorizationUrl,
      params.toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    const data = tokenResponse.data;

    if (data.error) {
      return NextResponse.redirect(
        new URL(
          `/analytics/linkedin?error=${encodeURIComponent(data.error_description || "Unable to sign in to LinkedIn")}`,
          request.url
        )
      );
    }

    const {
      access_token,
      refresh_token,
      expires_in,
      refresh_token_expires_in,
    } = data;

    const expiresAt = expires_in 
  ? Date.now() + Number(expires_in) * 1000 
  : Date.now() + 60 * 24 * 60 * 60 * 1000; 

  const refreshTokenExpiresAt = refresh_token_expires_in
  ? Date.now() + Number(refresh_token_expires_in) * 1000
  : undefined;



    const session = await getServerUser();
    if (!session || !session.email) {
      return NextResponse.redirect(new URL("/analytics/login", request.url));
    }

    const user = await findOne({
      email: session.email?.toLowerCase(),
    });
    if (!user) {
      return NextResponse.redirect(
        new URL(`/analytics/linkedin?error=Unable to find user`, request.url)
      );
    }

    const platform = user.socialMedia?.find((app: ISocial) => app.name === "linkedin");
    if (platform) {
      platform.accessToken = access_token;
      platform.expiresAt = expiresAt;
      platform.refreshToken = refresh_token;
      platform.refreshTokenExpiresAt = refreshTokenExpiresAt;

    } else {
      user.socialMedia?.push({
        name: "linkedin",
        accessToken: access_token,
        expiresAt,
        refreshToken: refresh_token,
        refreshTokenExpiresAt,
        userId: undefined
      });
    }

    await user.save();
    await LinkedInAuthState.findByIdAndDelete(authState._id);

    return NextResponse.redirect(new URL("/analytics/linkedin", request.url));
  } catch (error) {
    console.error(error);

    if (axios.isAxiosError(error) && error.response) {
      return NextResponse.redirect(
        new URL(
          `/analytics/linkedin?error=${encodeURIComponent(
            error.response.data.error_description || "Internal Server Error"
          )}`,
          request.url
        )
      );
    } else {
      return NextResponse.redirect(
        new URL(`/analytics/linkedin?error=Internal Server Error`, request.url)
      );
    }
  }
}
