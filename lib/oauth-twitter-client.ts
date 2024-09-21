
import { OAuth } from 'oauth';

export const oauth = new OAuth(
  "https://api.twitter.com/oauth/request_token",
  "https://api.twitter.com/oauth/access_token",
  process.env.TWITTER_API_KEY!,
  process.env.TWITTER_API_SECRET_KEY!,
  "1.0A",
  process.env.TWITTER_CALLBACK_URL!,
  "HMAC-SHA1"
);
