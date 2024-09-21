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
    />
  );
};

export default TikTokPage;
