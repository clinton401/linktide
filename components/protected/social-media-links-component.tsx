"use client"
import { FC } from "react";
import Link from "next/link";
import { LiaFacebookSquare } from "react-icons/lia";
import { CiInstagram } from "react-icons/ci";
import { RiTwitterXLine } from "react-icons/ri";
import { SlSocialLinkedin } from "react-icons/sl";
import { PiTiktokLogo } from "react-icons/pi";
import { Button } from "@/components/ui/button";
import { usePathname } from 'next/navigation';

export const SocialMediaLinks: FC = () => {
    const pathname = usePathname()
    const socialMediaPlatforms = [
        { name: "Facebook", url: "/analytics/facebook", icon: <LiaFacebookSquare/> },
        { name: "Instagram", url: "/analytics/instagram", icon: <CiInstagram/> },
        { name: "Twitter", url: "/analytics/twitter", icon: <RiTwitterXLine/> },
        { name: "LinkedIn", url: "/analytics/linkedin", icon: <SlSocialLinkedin/> },
        { name: "TikTok", url: "/analytics/tiktok", icon: <PiTiktokLogo/> }
      ];
      

  return (
    <>
      {socialMediaPlatforms.map((platform) => {
        const icon = platform.icon;
        return (
          <Button variant={pathname === platform.url ? "secondary": "outline"} className="flex w-full items-center text-sm gap-2" asChild key={platform.name}>
        
           <Link href={platform.url}>   {icon} {platform.name}</Link>
          </Button>
        );
      })}
    </>
  );
};
