import { FC } from "react";
import { AnalyticsParentComponent } from "@/components/protected/analytics-parent-component";
import { CiInstagram } from "react-icons/ci";

const InstagramPage: FC = () => {
  return (
    <AnalyticsParentComponent
      name="instagram"
      redirectUrl="/api/instagram/auth"
      icon={<CiInstagram className="ml-1" />}
    />
  );
};

export default InstagramPage;
