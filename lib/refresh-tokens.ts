import { connectToDatabase } from "@/lib/db";
import axios from "axios";
import { findOne } from "@/data/users-data";
import type { ISocial } from "@/models/social-media-schema";
import { TwitterApi } from 'twitter-api-v2';
export const getNewTiktokAccessToken = async (
  REFRESH_TOKEN: string,
  email: string
): Promise<string | undefined> => {
  const {
    TIKTOK_CLIENT_ID: CLIENT_ID,
    TIKTOK_CLIENT_SECRET: CLIENT_SECRET,
  } = process.env;

  if (!CLIENT_ID || !CLIENT_SECRET) {
    console.error("Client ID or Client Secret is not defined.");
    return undefined;
  }
  const authorizationUrl = "https://open.tiktokapis.com/v2/oauth/token/";
  
  try {
    await connectToDatabase();
    
    const params = new URLSearchParams({
      client_key: CLIENT_ID!,
      client_secret: CLIENT_SECRET!,
      grant_type: "refresh_token",
      refresh_token: REFRESH_TOKEN!,
    }).toString();

    const tokenResponse = await axios.post(authorizationUrl, params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const data = tokenResponse.data; 

    if (!data) {
      console.error("No data received from TikTok API.");
      return undefined;
    }

    const {
      access_token,
      refresh_token,
      expires_in,
      refresh_expires_in,
      open_id,
    } = data;

    const expiresAt = expires_in
      ? Date.now() + Number(expires_in) * 1000 
      : Date.now() + 24 * 60 * 60 * 1000; 

    const refreshTokenExpiresAt = refresh_expires_in
      ? Date.now() + Number(refresh_expires_in) * 1000 
      : Date.now() + 6 * 30 * 24 * 60 * 60 * 1000; 

    const user = await findOne({ email: email.toLowerCase() });

    if (!user) {
      console.error("User not found for the provided email.");
      return undefined;
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
        userId: open_id,
      });
    }

    await user.save();
    return access_token;
  } catch (error) {
    console.error("Failed to refresh access token:", error);
    throw new Error("Failed to refresh access token: ");
  }
};




export const refreshTwitterAccessToken = async (refreshToken: string, email: string): Promise<undefined | string> => {
  const {
    TWITTER_CLIENT_ID: clientId,
    TWITTER_CLIENT_SECRET: clientSecret,
  } = process.env;

  if (!clientId || !clientSecret) {
    throw new Error('Twitter client ID and secret are not defined');
  }

  try {
    const client = new TwitterApi({
      clientId: clientId,
      clientSecret: clientSecret,
    });

    const { client: refreshedClient,  accessToken, refreshToken: newRefreshToken, expiresIn } = await client.refreshOAuth2Token(refreshToken);
    const refreshTokenExpiresAt = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000);

    console.log('Refresh client:', refreshedClient);
    console.log('New Access Token:', accessToken);
    console.log('New Refresh Token:', newRefreshToken);
    console.log('Expires In:', expiresIn, 'seconds');

    const user = await findOne({ email: email.toLowerCase() });

    if (!user) {
      console.error("User not found for the provided email.");
      return undefined;
    }

    const platform = user.socialMedia?.find((app: ISocial) => app.name === "twitter");

    if (platform) {
      platform.accessToken = accessToken;
      platform.expiresAt = expiresIn;
      platform.refreshToken = newRefreshToken;
      platform.refreshTokenExpiresAt = refreshTokenExpiresAt;
    } else {
      user.socialMedia?.push({
        name: "twitter",
        accessToken,
        expiresAt: expiresIn,
        refreshToken: newRefreshToken,
        refreshTokenExpiresAt,
      });
    }

    await user.save();
    // return access_token;
    return accessToken;
  } catch (error) {
    console.error('Error refreshing  twitter access token:', error);
    throw error;
  }
};
