import { FC } from "react";
import { getServerUser } from "@/hooks/get-server-user";
import { bodoni } from "@/lib/fonts";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaUser } from "react-icons/fa";
import { redirect } from "next/navigation";
import { SettingsEditButton } from "@/components/protected/settings-edit-button";
import { Badge } from "@/components/ui/badge";
import { ModeToggle } from "@/components/mode-toggle";
import { SettingsProfileEditForm } from "@/components/protected/settings-profile-edit-form";
import { NewSecurityForm } from "@/components/protected/new-security-form";
import { LogoutAndDelete } from "@/components/protected/logout-and-delete";
export const metadata = {
  title: 'Settings',
  description: "Manage your Linktide account settings. Update personal information, security preferences, and configure your social media integrations.",
};

const SettingsPage: FC = async () => {
  const session = await getServerUser();
  if (!session) {
    redirect("/auth/login");
  }
  return (
    <div className="w-full px-[5%] min-h-dvh pt-6 md:pt-4 pb-[80px]   space-y-8">
      <h2
        className={` ${bodoni.className} text-xl font-black w-full text-left `}
      >
        My Profile
      </h2>

      <section className=" rounded-md w-full   flex-wrap flex items-center gap-y-4 gap-x-2 justify-between ">
        <div className=" flex items-center flex-wrap gap-4">
          <Avatar className="w-[80px] h-[80px]">
            <AvatarImage
              src={session?.image || ""}
              alt={`${session?.name || "User"} image`}
            />
            <AvatarFallback>
              <FaUser className="text-[40px] aspect-square" />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col *:text-sm gap-2 ">
            <h4>{session.name}</h4>
            <p>{session.email}</p>{" "}
          </div>
        </div>
        <div className=" flex items-center gap-4 flex-grow justify-end">
          <SettingsEditButton>
            <SettingsProfileEditForm session={session} />
          </SettingsEditButton>
        </div>
      </section>
      <h2
        className={` ${bodoni.className} text-xl font-black w-full text-left `}
      >
        Security
      </h2>
      <section className=" rounded-md w-full gap-4    flex items-center flex-col justify-center ">
        <div className="w-full flex items-center justify-between gap-x-4 gap-y-6">
          <span className=" flex flex-col gap-2 text-sm">
            <h4 className="font-bold text-primary ">
              Two-factor authentication
            </h4>
            <p className="text-xs ">
              Keep your account secure by enabling 2FA by using a temporary
              one-time passcode(OTP);
            </p>
          </span>
          <Badge variant={session["2FA"] ? "default" : "destructive"}>
            {session["2FA"] ? "On" : "Off"}
          </Badge>
        </div>
        <div className="w-full flex items-center justify-end ">
          <SettingsEditButton><NewSecurityForm session={session}/></SettingsEditButton>
        </div>
      </section>
      <h2
        className={` ${bodoni.className} text-xl font-black w-full text-left `}
      >
        Appearance
      </h2>
      <section className=" rounded-md w-full gap-4    flex items-center flex-col justify-center ">
    
          <div className="w-full flex items-center justify-between gap-x-4 gap-y-6">
            <span className=" flex flex-col gap-2 text-sm">
              <h4 className="font-bold text-primary ">Theme</h4>
              <p className="text-xs ">
                Customise how your theme looks on your device
              </p>
            </span>
            <ModeToggle />
          </div>
      
      </section>

     <LogoutAndDelete/>
    </div>
  );
};

export default SettingsPage;
