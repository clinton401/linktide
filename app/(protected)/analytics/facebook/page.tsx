import { FC } from "react";

import { bodoni } from "@/lib/fonts";
export const metadata = {
  title: 'Facebook Analytics Overview',
  description: "Get a quick look at your Facebook analytics and user data through Linktide. Access essential insights into post performance and engagement.",
};

const FacebookPage: FC = () => {
  return (
    <section className="w-full px-[5%] pt-6 md:pt-4  flex items-center min-h-dvh justify-center gap-6 flex-col">
      <h1 className={` ${bodoni.className} text-3xl font-black w-full text-center `}>

      We&apos;re sorry, but this feature is temporarily unavailable. Our team is working hard to restore it as soon as possible. Thank you for your understanding and patience. Stay tuned for updates!
      </h1>
    </section>
  );
};

export default FacebookPage;
