import { NextResponse, NextRequest } from "next/server";
import AuthState from "@/models/auth-state-schema";
import { connectToDatabase } from "@/lib/db";
import axios from "axios";
import { getServerUser } from "@/hooks/get-server-user";
import { findOne } from "@/data/users-data";
import type { ISocial } from "@/models/social-media-schema";

export async function GET(request: NextRequest) {
  const {
    TIKTOK_CLIENT_ID: CLIENT_ID,
    TIKTOK_CLIENT_SECRET: CLIENT_SECRET,
  } = process.env;
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");
  const error_description = url.searchParams.get("error_description")
  const REDIRECT_URI = process.env.TIKTOK_REDIRECT_URI || "http://localhost:3000/api/tiktok/callback";
  const authorizationUrl = `https://open.tiktokapis.com/v2/oauth/token/`;

  if (!CLIENT_ID || !CLIENT_SECRET ) {
    return NextResponse.redirect(
      new URL(`/analytics/tiktok?error=${encodeURIComponent("CLIENT ID and SECRET are required")}`, request.url)
    );
  }
  if (error || error_description) {
    NextResponse.redirect(
      new URL(`/analytics/tiktok?error=${encodeURIComponent("Authorization failed: " + error_description )}`, request.url)
    );
   
  }
  if (error || !code || !state) {
    return NextResponse.redirect(
      new URL(`/analytics/tiktok?error=${encodeURIComponent("Code or state parameter missing")}`, request.url)
    );
  }

  try {
    await connectToDatabase();

    const authState = await AuthState.findOne({
      state,
      expiresAt: { $gte: new Date() },
    });
    if (!authState) {
      return NextResponse.redirect(
        new URL(`/analytics/tiktok?error=${encodeURIComponent("Invalid or expired state")}`, request.url)
      );
    }
    const codeChallenge = authState?.codeChallenge;
    if(!codeChallenge)return NextResponse.redirect(
      new URL(`/analytics/tiktok?error=${encodeURIComponent("No code verifier available")}`, request.url)
    );

    await AuthState.findOneAndDelete({ state });

    const params = new URLSearchParams({
      client_key: CLIENT_ID!,
      client_secret: CLIENT_SECRET!,
      code,
      grant_type: "authorization_code",
      redirect_uri: REDIRECT_URI!,
      code_verifier: codeChallenge,
    }).toString();
    const tokenResponse = await axios.post(
      authorizationUrl,
      params,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    const data = tokenResponse.data;
console.log(data)
    if (!data) {
      return NextResponse.redirect(
        new URL(
          `/analytics/tiktok?error=${encodeURIComponent("Unable to sign in to tiktok")}`,
          request.url
        )
      );
    }

    const {
      access_token, refresh_token,
      expires_in,
      refresh_expires_in,
      open_id
    } = data;

    const expiresAt = expires_in 
    ? Date.now() + Number(expires_in) * 1000  
    : Date.now() + 24 * 60 * 60 * 1000;
  
  const refreshTokenExpiresAt = refresh_expires_in
    ? Date.now() + Number(refresh_expires_in) * 1000  
    : Date.now() + 6 * 30 * 24 * 60 * 60 * 1000; 
  



    const session = await getServerUser();
    if (!session || !session.email) {
      return NextResponse.redirect(new URL("/analytics/login", request.url));
    }

    const user = await findOne({
      email: session.email?.toLowerCase(),
    });
    if (!user) {
      return NextResponse.redirect(
        new URL(`/analytics/tiktok?error=Unable to find user`, request.url)
      );
    }

    const platform = user.socialMedia?.find((app: ISocial) => app.name === "tiktok");
    if (platform) {
      platform.accessToken = access_token;
      platform.expiresAt = expiresAt;
      platform.refreshToken = refresh_token;
      platform.refreshTokenExpiresAt = refreshTokenExpiresAt;
      platform.userId = open_id;

    } else {
      user.socialMedia?.push({
        name: "tiktok",
        accessToken: access_token,
        expiresAt,
        refreshToken: refresh_token,
        refreshTokenExpiresAt,
        userId: open_id
      });
    }

    await user.save();

    return NextResponse.redirect(new URL("/analytics/tiktok", request.url));
  } catch (error) {
    console.error(error);

    if (axios.isAxiosError(error) && error.response) {
      return NextResponse.redirect(
        new URL(
          `/analytics/tiktok?error=${encodeURIComponent(
            error.response.data.error_description || "Internal Server Error"
          )}`,
          request.url
        )
      );
    } else {
      return NextResponse.redirect(
        new URL(`/analytics/tiktok?error=Internal Server Error`, request.url)
      );
    }
  }
}
