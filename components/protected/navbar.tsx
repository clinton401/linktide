"use client";
import { FC } from "react";
import { CiSettings, CiSquarePlus } from "react-icons/ci";
import { IoMdSettings } from "react-icons/io";
import { FaSquarePlus } from "react-icons/fa6";
import { MdOutlineDashboard, MdDashboard } from "react-icons/md";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePathname } from "next/navigation";
import { FaUser } from "react-icons/fa";
import Link from "next/link";
import { useCurrentUser } from "@/hooks/use-current-user";

export const Navbar: FC = () => {
  const user = useCurrentUser();
  const pathname = usePathname();


  

  return (
    <header>
      <nav className="fixed z-20 text-gray-300 hidden w-[75px] hover:w-[200px] py-4 px-4 transition-all ease-linear duration-300 md:flex flex-col gap-y-12 min-h-dvh bg-primary desktop_header left-0 top-0">
        <div className="flex w-[44px] flex-col items-center justify-center">
          <Avatar>
            <AvatarImage src={user?.image || ""} alt={`${user?.name || "User"} image`} />
            <AvatarFallback><FaUser /></AvatarFallback>
          </Avatar>
          <h3 className="truncate text-sm">Clinton</h3>
        </div>
        <section className="w-full flex-col *:flex overflow-x-hidden *:items-end flex gap-y-6">
          <Link href="/analytics/facebook">
            {pathname.startsWith("/analytics") ? (
              <MdDashboard className="text-2xl text-white min-w-[26px]" />
            ) : (
              <MdOutlineDashboard className="text-2xl min-w-[26px]" />
            )}
            <span className={`link_text font-bold text-sm ${pathname.startsWith("/analytics") ? "text-white" : ""}`}>
              Analytics
            </span>
          </Link>
          <Link href="/create-post">
            {pathname.startsWith("/create-post") ? (
              <FaSquarePlus className="text-2xl text-white min-w-[26px]" />
            ) : (
              <CiSquarePlus className="text-2xl min-w-[26px]" />
            )}
            <span className={`link_text font-bold text-sm ${pathname.startsWith("/create-post") ? "text-white" : ""}`}>
              Post
            </span>
          </Link>
          <Link href="/settings">
            {pathname.startsWith("/settings") ? (
              <IoMdSettings className="text-2xl text-white min-w-[26px]" />
            ) : (
              <CiSettings className="text-2xl min-w-[26px]" />
            )}
            <span className={`link_text font-bold text-sm ${pathname.startsWith("/settings") ? "text-white" : ""}`}>
              Settings
            </span>
          </Link>
        </section>
      </nav>
      <nav className="flex md:hidden w-full fixed max-h-[65px] left-0 bottom-0 p-4 bg-background border-t">
        <ul className="items-center flex gap-x-2 w-full justify-evenly">
          <li>
            <Link href="/analytics/facebook">
              {pathname.startsWith("/analytics") ? (
                <MdDashboard className="text-2xl text-foreground" />
              ) : (
                <MdOutlineDashboard className="text-2xl" />
              )}
            </Link>
          </li>
          <li>
            <Link href="/create-post">
              {pathname.startsWith("/create-post") ? (
                <FaSquarePlus className="text-2xl text-foreground" />
              ) : (
                <CiSquarePlus className="text-2xl" />
              )}
            </Link>
          </li>
          <li>
            <Link href="/settings">
              {pathname.startsWith("/settings") ? (
                <IoMdSettings className="text-2xl text-foreground" />
              ) : (
                <CiSettings className="text-2xl" />
              )}
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};
