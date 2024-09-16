import { FC } from "react";
import { bodoni } from '@/lib/fonts';
import { AnalyticsParentComponent } from "@/components/protected/analytics-parent-component";
import { CiInstagram } from "react-icons/ci";

import { ModeToggle } from "@/components/mode-toggle";
const InstagramPage: FC = () => {
  return (
    <AnalyticsParentComponent
      name="instagram"
      redirectUrl="/analytics/instagram"
      icon={<CiInstagram className="ml-1" />}
    >
      <h1 className={` ${bodoni.className} text-6xl font-black`}>
        Welcome to analytics page
      </h1>
      <ModeToggle />
    </AnalyticsParentComponent>
  );
};

export default InstagramPage;
