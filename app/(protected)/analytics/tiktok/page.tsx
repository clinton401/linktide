import { FC } from "react";
import { AnalyticsParentComponent } from "@/components/protected/analytics-parent-component";
import { PiTiktokLogo } from "react-icons/pi";
import { bodoni } from "@/lib/fonts";
import { getSocialAuthState } from "@/hooks/get-social-auth-state";
import { tiktokData } from "@/actions/tiktok-data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaUser } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
export const metadata = {
  title: 'TikTok Analytics Overview',
  description: "View a snapshot of your TikTok analytics and user data with Linktide. Access basic insights into video performance and audience growth.",
};


const TikTokPage: FC = async () => {
  const isAuth = await getSocialAuthState("tiktok");
  if (!isAuth) {
    return (
      <AnalyticsParentComponent
        name="tiktok"
        redirectUrl="/api/tiktok/auth"
        icon={<PiTiktokLogo className="ml-1" />}
      />
    );
  }
  const userData = await tiktokData();
  const { data, error } = userData;
  if (error || !data) {
    throw new Error(error || "Unable to retrieve user data");
  }
  return (
    <section className="w-full px-[5%] min-h-dvh pt-6 md:pt-4  space-y-8">
      <h2
        className={` ${bodoni.className} text-xl font-black w-full text-left `}
      >
        Analytics / Tiktok
      </h2>
      <section className="w-full flex-col-reverse gap-y-6 md:flex-row flex items-center justify-center ">
        <Card className="w-full md:w-1/2  max-w-[350px]">
          <CardHeader className="flex flex-col *:text-center items-center justify-center ">
            <CardTitle
              className={`font-black flex items-center justify-center  ${bodoni.className} text-3xl`}
            >
              {data.display_name}
            </CardTitle>
            <CardDescription>@{data.username}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="w-full flex justify-center  flex-wrap gap-4">
              <span className="">Followers: {data.follower_count}</span>
              <span className="">Following: {data.following_count}</span>
            </div>
            <div className="w-full flex justify-center flex-wrap gap-4">
              <span className="">Total Likes: {data.likes_count}</span>
              <span className="">Total Videos: {data.video_count}</span>
            </div>
            <p className="w-full text-center">{data.bio_description || "No bio available."}</p>{" "}
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button asChild size="lg">
              <Link href={data.profile_deep_link}>View Full Profile</Link>
            </Button>
          </CardFooter>
        </Card>
        

        <div className="w-full md:w-1/2 flex items-center justify-center">
          <Avatar className="w-[150px] h-[150px]">
            <AvatarImage
              src={data.avatar_url || ""}
              alt={`${data?.display_name || "User"} image`}
            />
            <AvatarFallback>
              <FaUser className="text-[50px] aspect-square" />
            </AvatarFallback>
          </Avatar>
        </div>
      </section>
    </section>
  );
};

export default TikTokPage;
