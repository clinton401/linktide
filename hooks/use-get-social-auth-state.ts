import { useGetSocialMediaDetails } from "@/hooks/use-get-social-media-details";
export const useGetSocialAuthState = async (name: string) => {
  const platform = await useGetSocialMediaDetails(name);
  if (!platform || !platform?.accessToken || !platform?.expiresAt) return false;
  const refreshExpire = platform?.refreshTokenExpiresAt
    ? platform.refreshTokenExpiresAt
    : null;
  const refreshExpireDate = refreshExpire ? new Date(refreshExpire) : null;
  const now = new Date();
  const isRefreshExpired = refreshExpireDate ? refreshExpireDate < now : false;
  if (platform.refreshToken && isRefreshExpired) return false;

  const accessExpire = platform?.expiresAt;
  const accessExpireDate = new Date(accessExpire);
  const isExpired = accessExpireDate < now;
  if (isExpired) {
    return false;

  } else {
    return true
  }


};
