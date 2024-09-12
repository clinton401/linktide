import { FC } from "react";
import { Roboto_Slab } from "next/font/google";
import { AnalyticsParentComponent } from "@/components/protected/analytics-parent-component";
import { RiTwitterXLine } from "react-icons/ri";
const roboto = Roboto_Slab({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});
import { ModeToggle } from "@/components/mode-toggle";
const TwitterPage: FC = () => {
  return (
    <AnalyticsParentComponent
      name="twitter"
      redirectUrl="/analytics/twitter"
      icon={<RiTwitterXLine className="ml-1" />}
    >
      <h1 className={` ${roboto.className} text-6xl font-black`}>
        Welcome to analytics page
      </h1>
      <ModeToggle />
    </AnalyticsParentComponent>
  );
};

export default TwitterPage;
