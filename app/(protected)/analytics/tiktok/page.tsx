import { FC } from "react";
import { AnalyticsParentComponent } from "@/components/protected/analytics-parent-component";
import { PiTiktokLogo } from "react-icons/pi";
import { bodoni } from "@/lib/fonts";
import { getSocialAuthState } from "@/hooks/get-social-auth-state";
import { Button } from "@/components/ui/button";
import Link from "next/link";
const TikTokPage: FC = async() => {
  const isAuth = await getSocialAuthState("tiktok");
  if (!isAuth) {
    return (
      <AnalyticsParentComponent
        name="tiktok"
        redirectUrl="/api/tiktok/auth"
        icon={<PiTiktokLogo className="ml-1" />}
      />
    );
  }
  return (
    <section className="w-full px-[5%] min-h-dvh pt-4  space-y-6">
      <h2
        className={` ${bodoni.className} text-xl font-black w-full text-left `}
      >
        Analytics / Tiktok
      </h2>
      <h1 className={`  text-center  text-3xl font-black`}>
        User data and analytics are currently unavailable. However, you can
        still create and share posts through our platform. Navigate to the
        "Create Post" section, or click the button below to get started.
      </h1>
      <div className="w-full flex items-center justify-center">
        <Button asChild size="lg">
          <Link href="/create-post"> Create post</Link>
        </Button>
      </div>
    </section>
  )
};

export default TikTokPage;
