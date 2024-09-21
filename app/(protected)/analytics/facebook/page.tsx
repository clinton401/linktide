import { FC } from "react";
import { AnalyticsParentComponent } from "@/components/protected/analytics-parent-component";
import { LiaFacebookSquare } from "react-icons/lia";
const FacebookPage: FC = () => {
  return (
    <AnalyticsParentComponent
      name="facebook"
      redirectUrl="/api/facebook/auth"
      icon={<LiaFacebookSquare className="ml-1" />}
    />
  );
};

export default FacebookPage;
