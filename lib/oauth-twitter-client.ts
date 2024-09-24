
import { OAuth } from 'oauth';
import axios from 'axios';

const bearerToken = process.env.TWITTER_BEARER_TOKEN!; // Add your bearer token here

export const fetchTwitterData = async (url: string, accessToken: string) => {
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error fetching Twitter data:', (error as any)?.response?.data || error.message);
    } else {
      console.error('Unknown error occurred');
    }
    throw error; // Rethrow the error after logging
  }
};

export const oauth = new OAuth(
  "https://api.twitter.com/oauth/request_token",
  "https://api.twitter.com/oauth/access_token",
  process.env.TWITTER_API_KEY!,
  process.env.TWITTER_API_SECRET_KEY!,
  "1.0A",
  process.env.TWITTER_REDIRECT_URI!,
  "HMAC-SHA1"
);
