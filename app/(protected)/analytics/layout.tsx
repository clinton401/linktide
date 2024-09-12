
import {SocialMediaLinks} from "@/components/protected/social-media-links-component"
export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

        <div className="p-0 md:pl-[180px]">
            <aside className="fixed hidden md:flex items-center py-4 text-foreground gap-y-6 flex-col top-0 left-[75px] min-h-dvh px-[2%] border-r w-[180px]">
                <SocialMediaLinks/>
            </aside>
          {children}
        </div>
      
  );
}
