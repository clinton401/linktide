import { FC } from "react";
import { FuzzyOverlay } from "@/components/framer-motion/fuzzy-overlay";

import { LoginButton } from "@/components/login-button";
import { appearAnimation } from "@/lib/framer-motion-utils";
import { MotionComponent } from "@/components/framer-motion/motion-component";
import { bodoni } from "@/lib/fonts";
import { getServerUser } from "@/hooks/get-server-user";
import { Button } from "@/components/ui/button";
import Link from "next/link";
const Home: FC = async () => {
  const session = await getServerUser();
  return (
    <main
      className="relative overflow-hidden min-h-dvh px-p-half py-8 flex items-center justify-center "
      id="auth"
    >
      <MotionComponent
        variants={appearAnimation}
        initial="hidden"
        animate="visible"
        className="relative  items-center justify-center flex  flex-col gap-y-6   "
      >
        <h1
          className={`text-center text-4xl ${bodoni.className} flex items-center justify-center  sm:text-6xl font-black text-neutral-50`}
        >
          Welcome to Linktide
        </h1>
        <p className="text-center  text-neutral-400 w-full md:w-3/4">
          Linktide is your all-in-one solution for streamlining social media
          management. With our platform, users can effortlessly view analytics
          from multiple social media accounts and post content to all connected
          platforms with a single action. Simplify your social media strategy,
          track performance metrics, and manage your online presence more
          effectively from one convenient location.
        </p>
        {session ? (
          <Button size="lg">
            <Link href="/analytics/tiktok">View analytics</Link>
          </Button>
        ) : (
          <LoginButton />
        )}
      </MotionComponent>

      <FuzzyOverlay />
    </main>
  );
};
export default Home;
