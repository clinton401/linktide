import { FC, ReactNode } from "react";
import { Navbar } from "@/components/protected/navbar";
import { getServerUser } from "@/hooks/get-server-user";
import { redirect } from "next/navigation";
type ParentLayoutProps = {
  children: ReactNode;
};
export const ParentLayout: FC<ParentLayoutProps> = async ({ children }) => {
  const user = await getServerUser();
  if (!user) {
    redirect("/auth/login");
  }
  return (
    <main
      className="w-full min-h-dvh  bg-background md:pl-[76px]"
      id="protected"
    >
      <Navbar user={user} />
      {children}
    </main>
  );
};
