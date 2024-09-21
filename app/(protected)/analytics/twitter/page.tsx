import { FC } from "react";
import { AnalyticsParentComponent } from "@/components/protected/analytics-parent-component";
import { RiTwitterXLine } from "react-icons/ri";
import { bodoni } from '@/lib/fonts';
import { ModeToggle } from "@/components/mode-toggle";
import { twitterData } from "@/actions/twitter-data";
import { getSocialAuthState } from "@/hooks/get-social-auth-state";
const TwitterPage: FC = async() => {
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
  const userData = await twitterData();
  console.log(userData);
  // const { data, error } = userData;
  return (
    <section className="w-full px-[5%] min-h-dvh pt-4  space-y-6"
    >
      <h1 className={` ${bodoni.className} text-6xl font-black`}>
        Welcome to analytics page
      </h1>
      <ModeToggle />
    </section>
  );
};

export default TwitterPage;
