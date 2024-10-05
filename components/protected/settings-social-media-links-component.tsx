"use client";
import { FC } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";

export const SettingsSocialMediaLinks: FC = () => {
  const pathname = usePathname();
  const socialMediaPlatforms = [
    { name: "General", url: "/settings/general"},
    {
      name: "Security",
      url: "/settings/security"
    }
  ];

  return (
    <>
      {socialMediaPlatforms.map((platform) => {
        return (
          <Button
            variant={pathname === platform.url ? "secondary" : "outline"}
            className="flex w-full items-center text-sm gap-2"
            asChild
            key={platform.name}
          >
            <Link href={platform.url}>
               {platform.name}
            </Link>
          </Button>
        );
      })}
    </>
  );
};
