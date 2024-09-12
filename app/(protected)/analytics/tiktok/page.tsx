import { FC } from "react";
import { Roboto_Slab } from "next/font/google";
import { AnalyticsParentComponent } from "@/components/protected/analytics-parent-component";
import { PiTiktokLogo } from "react-icons/pi";
const roboto = Roboto_Slab({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});
import { ModeToggle } from "@/components/mode-toggle";
const TikTokPage: FC = () => {
  return (
    <AnalyticsParentComponent
      name="tiktok"
      redirectUrl="/analytics/tiktok"
      icon={<PiTiktokLogo className="ml-1" />}
    >
      <h1 className={` ${roboto.className} text-6xl font-black`}>
        Welcome to analytics page
      </h1>
      <ModeToggle />
    </AnalyticsParentComponent>
  );
};

export default TikTokPage;
