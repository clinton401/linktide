import { FC } from "react";
import { AnalyticsParentComponent } from "@/components/protected/analytics-parent-component";
import { PiTiktokLogo } from "react-icons/pi";
import { bodoni } from '@/lib/fonts';
import { ModeToggle } from "@/components/mode-toggle";
const TikTokPage: FC = () => {
  return (
    <AnalyticsParentComponent
      name="tiktok"
      redirectUrl="/api/tiktok/auth"
      icon={<PiTiktokLogo className="ml-1" />}
    >
      <h1 className={` ${bodoni.className} text-6xl font-black`}>
        Welcome to analytics page
      </h1>
      <ModeToggle />
    </AnalyticsParentComponent>
  );
};

export default TikTokPage;
