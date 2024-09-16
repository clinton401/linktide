import { FC } from "react";
import { AnalyticsParentComponent } from "@/components/protected/analytics-parent-component";
import { SlSocialLinkedin } from "react-icons/sl";
import { bodoni } from '@/lib/fonts';
import { ModeToggle } from "@/components/mode-toggle";
const LinkedInPage: FC = () => {
  return (
    <AnalyticsParentComponent
      name="linkedin"
      redirectUrl="/analytics/linkedin"
      icon={<SlSocialLinkedin className="ml-1" />}
    >
      <h1 className={` ${bodoni.className} text-6xl font-black`}>
        Welcome to analytics page
      </h1>
      <ModeToggle />
    </AnalyticsParentComponent>
  );
};

export default LinkedInPage;
