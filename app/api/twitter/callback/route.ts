import { NextResponse, NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/db";
import axios from "axios";
import { getServerUser } from "@/hooks/get-server-user";
import { findOne } from "@/data/users-data";
import type { ISocial } from "@/models/social-media-schema";
import { oauth } from "@/lib/oauth-twitter-client";
import TwitterOauthToken from "@/models/twitter-oauth-token-schema";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const oauthToken = url.searchParams.get("oauth_token");
  const oauthVerifier = url.searchParams.get("oauth_verifier");

  if (!oauthToken || !oauthVerifier) {
    return NextResponse.redirect(
      new URL(
        `/analytics/twitter?error=${encodeURIComponent(
          "Invalid callback parameters"
        )}`,
        request.url
      )
    );
  }

  try {
    await connectToDatabase();

    const tokenRecord = await TwitterOauthToken.findOne({ oauthToken });
    if (!tokenRecord) {
      return NextResponse.redirect(
        new URL(
          `/analytics/twitter?error=${encodeURIComponent(
            "Twitter OAuth token not found"
          )}`,
          request.url
        )
      );
    }
    const { oauthTokenSecret } = tokenRecord;

    const { accessToken, accessTokenSecret } = await new Promise<{
      accessToken: string;
      accessTokenSecret: string;
    }>((resolve, reject) => {
      oauth.getOAuthAccessToken(
        oauthToken,
        oauthTokenSecret,
        oauthVerifier,
        (error, accessToken, accessTokenSecret) => {
          if (error) {
            reject(error);
          } else {
            resolve({ accessToken, accessTokenSecret });
          }
        }
      );
    });

    const expiresAt = Date.now() + 6 * 30 * 24 * 60 * 60 * 1000;

    const refreshTokenExpiresAt = Date.now() + 6 * 30 * 24 * 60 * 60 * 1000;

    const session = await getServerUser();
    if (!session || !session.email) {
      return NextResponse.redirect(new URL("/analytics/login", request.url));
    }

    const user = await findOne({
      email: session.email?.toLowerCase(),
    });
    if (!user) {
      return NextResponse.redirect(
        new URL(`/analytics/twitter?error=Unable to find user`, request.url)
      );
    }

    const platform = user.socialMedia?.find(
      (app: ISocial) => app.name === "twitter"
    );
    if (platform) {
      platform.accessToken = accessToken;
      platform.expiresAt = expiresAt;
      platform.refreshToken = accessTokenSecret;
      platform.refreshTokenExpiresAt = refreshTokenExpiresAt;
    } else {
      user.socialMedia?.push({
        name: "twitter",
        accessToken: accessToken,
        expiresAt,
        refreshToken: accessTokenSecret,
        refreshTokenExpiresAt,
        userId: undefined,
      });
    }
    await TwitterOauthToken.findOneAndDelete({ oauthToken });
    await user.save();

    return NextResponse.redirect(new URL("/analytics/twitter", request.url));
  } catch (error) {
    console.error(error);

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
      return NextResponse.redirect(
        new URL(`/analytics/twitter?error=Internal Server Error`, request.url)
      );
    }
  }
}
