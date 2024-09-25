import { FC } from "react";
import { AnalyticsParentComponent } from "@/components/protected/analytics-parent-component";
import { RiTwitterXLine } from "react-icons/ri";
import { bodoni } from "@/lib/fonts";
import { getSocialAuthState } from "@/hooks/get-social-auth-state";
import { Button } from "@/components/ui/button";
import Link from "next/link";
const TwitterPage: FC = async () => {
  const isAuth = await getSocialAuthState("twitter");
  if (!isAuth) {
    return (
      <AnalyticsParentComponent
        name="twitter"
        redirectUrl="/api/twitter/auth"
        icon={<RiTwitterXLine className="ml-1" />}
      />
    );
  }

  return (
    <section className="w-full px-[5%] min-h-dvh pt-6 md:pt-4 space-y-8">
      <h2
        className={` ${bodoni.className} text-xl font-black w-full text-left `}
      >
        Analytics / Twitter
      </h2>
      <h1 className={`  text-center  text-3xl font-black`}>
        User data and analytics are currently unavailable. However, you can
        still create and share posts through our platform. Navigate to the
        Create Post section, or click the button below to get started.
      </h1>
      <div className="w-full flex items-center justify-center">
        <Button asChild size="lg">
          <Link href="/create-post"> Create post</Link>
        </Button>
      </div>
    </section>
  );
};

export default TwitterPage;
