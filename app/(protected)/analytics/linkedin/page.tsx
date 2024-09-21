import { FC } from "react";
import { AnalyticsParentComponent } from "@/components/protected/analytics-parent-component";
import { SlSocialLinkedin } from "react-icons/sl";
import { bodoni } from "@/lib/fonts";
import { ModeToggle } from "@/components/mode-toggle";
import { useGetSocialAuthState } from "@/hooks/use-get-social-auth-state";
import { linkedinData } from "@/actions/linkedin-data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaUser } from "react-icons/fa";
const LinkedInPage: FC = async () => {
  const isAuth = await useGetSocialAuthState("linkedin");
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
    <section className="w-full px-[5%] min-h-dvh pt-4  space-y-6">
      <h2
        className={` ${bodoni.className} text-xl font-black w-full text-left `}
      >
        Analytics / Linkedin
      </h2>
      <section className="w-full flex-col-reverse gap-y-6 md:flex-row flex items-center justify-center ">
        <ul className="flex  flex-col justify-center w-full md:w-1/2 gap-4">
          <li>Name: {data.name}</li>
          {data?.email && <li>Email: {data.email}</li>}
          {data?.email_verified === false && (
            <li>
              Your LinkedIn email is unverified. Please visit LinkedIn to verify
              it and ensure full access to services. Thank you!
            </li>
          )}
        </ul>
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
      <h1 className={`  pt-[50px] text-3xl font-black w-full text-center `}>
        LinkedIn does not provide additional analytics data at the moment. These
        are the only metrics available for now. Thank you for your
        understanding!
      </h1>
    </section>
  );
};

export default LinkedInPage;
