import { FC } from "react";
import { AnalyticsParentComponent } from "@/components/protected/analytics-parent-component";
import { RiTwitterXLine } from "react-icons/ri";
import { bodoni } from '@/lib/fonts';
import { ModeToggle } from "@/components/mode-toggle";
const TwitterPage: FC = () => {
  return (
    <AnalyticsParentComponent
      name="twitter"
      redirectUrl="/analytics/twitter"
      icon={<RiTwitterXLine className="ml-1" />}
    >
      <h1 className={` ${bodoni.className} text-6xl font-black`}>
        Welcome to analytics page
      </h1>
      <ModeToggle />
    </AnalyticsParentComponent>
  );
};

export default TwitterPage;
