import { getSocialMediaDetails } from "@/hooks/get-social-media-details";
export const getSocialAuthState = async (name: string) => {
  const platform = await getSocialMediaDetails(name);
  if (!platform || !platform?.accessToken || !platform?.expiresAt) return false;
  const refreshExpire = platform?.refreshTokenExpiresAt
    ? platform.refreshTokenExpiresAt
    : null;
  // console.log(`refreshExpire: ${refreshExpire}`);
  const refreshExpireDate = refreshExpire ? new Date(refreshExpire) : null;
  const now = new Date();
  // console.log(`refreshExpireDate: ${refreshExpireDate}`);
  const isRefreshExpired = refreshExpireDate ? refreshExpireDate < now : false;

  // console.log(`isRefreshExpired: ${isRefreshExpired}`);
  if (platform.refreshToken && isRefreshExpired) return false;

  const accessExpire = platform?.expiresAt;

  // console.log(`accessExpire: ${accessExpire}`);
  const accessExpireDate = new Date(accessExpire);

  // console.log(`accessExpireDate: ${accessExpireDate}`)
  const isAccessExpired = accessExpireDate < now;

  // console.log(`isAccessExpired: ${isAccessExpired}`);
  const isExpired = isRefreshExpired && isAccessExpired ? true : false;
  
  // console.log(`isExpired: ${isExpired}`);
  if (isExpired) {
    // console.log("User auth is expired");
    return false;
  } else {
    // console.log("User auth is not expired");
    return true;
  }
};
