import { FC } from "react";
import { AnalyticsParentComponent } from "@/components/protected/analytics-parent-component";
import { LiaFacebookSquare } from "react-icons/lia";
import { bodoni } from "@/lib/fonts";
import { ModeToggle } from "@/components/mode-toggle";
const FacebookPage: FC = () => {
  return (
    <AnalyticsParentComponent
      name="facebook"
      redirectUrl="/api/facebook/auth"
      icon={<LiaFacebookSquare className="ml-1" />}
    >
      <h1 className={` ${bodoni.className} text-6xl font-black`}>
        Welcome to analytics page
      </h1>
      <ModeToggle />
    </AnalyticsParentComponent>
  );
};

export default FacebookPage;
