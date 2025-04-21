import { FC } from "react";
import { AnalyticsParentComponent } from "@/components/protected/analytics-parent-component";
import { SlSocialLinkedin } from "react-icons/sl";
import { bodoni } from "@/lib/fonts";
import { getSocialAuthState } from "@/hooks/get-social-auth-state";
import { linkedinData } from "@/actions/linkedin-data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaUser } from "react-icons/fa";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlatformLogoutButton } from "@/components/platform-logout-button";
export const metadata = {
  title: "LinkedIn Analytics Overview",
  description:
    "Access key insights into your LinkedIn activity with Linktide. View limited analytics and user data on post performance and engagement.",
};

const LinkedInPage: FC = async () => {
  const isAuth = await getSocialAuthState("linkedin");
  if (!isAuth) {
    return (
      <AnalyticsParentComponent
        name="linkedin"
        redirectUrl="/api/linkedin/auth"
        icon={<SlSocialLinkedin className="ml-1" />}
      />
    );
  }

  const userData = await linkedinData();
  const { data, error } = userData;

  if (error || !data) {
    throw new Error(error || "Unable to retrieve user data");
  }
  return (
    <section className="w-full px-[5%] min-h-dvh pt-6 md:pt-4 space-y-8">
      <h2
        className={` ${bodoni.className} text-xl font-black w-full text-left `}
      >
        Analytics / Linkedin
      </h2>
      <section className="w-full flex-col-reverse gap-y-6 md:flex-row flex items-center justify-center ">
        <Card className="w-full md:w-1/2  max-w-[350px]">
          <CardHeader className="flex flex-col *:text-center items-center justify-center ">
            <CardTitle
              className={`font-black flex items-center justify-center  ${bodoni.className} text-3xl`}
            >
              {data.name}
            </CardTitle>
            <CardDescription>{data.email}</CardDescription>
          </CardHeader>
          <CardContent>
            {data?.email_verified === false && (
              <p className="">
                {" "}
                Your LinkedIn email is unverified. Please visit LinkedIn to
                verify it and ensure full access to services. Thank you!
              </p>
            )}{" "}
          </CardContent>
        </Card>

        <div className="w-full md:w-1/2 flex items-center justify-center">
          <Avatar className="w-[100px] h-[100px]">
            <AvatarImage
              src={data.picture || ""}
              alt={`${data?.name || "User"} image`}
            />
            <AvatarFallback>
              <FaUser className="text-[50px] aspect-square" />
            </AvatarFallback>
          </Avatar>
        </div>
      </section>
      <h1 className={`   text-3xl font-black w-full text-center `}>
        LinkedIn does not provide additional analytics data at the moment. These
        are the only metrics available for now. Thank you for your
        understanding!

      </h1>
      <section className="w-full flex items-center justify-center ">
        <PlatformLogoutButton name="linkedin" />
      </section>
    </section>
  );
};

export default LinkedInPage;
