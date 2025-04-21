"use client";
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { bodoni } from '@/lib/fonts';
import {FuzzyOverlay} from "@/components/framer-motion/fuzzy-overlay"

function ErrorPage({ error }: { error: Error,  reset: () => void }) {
  
    useEffect(() => {
        console.error(`${error}`);
    }, [error]);
    const refreshHandler = () => {
  
     window.location.reload()
    }
    return (
      <main className=" min-h-dvh  overflow-hidden relative py-4 px-p-half flex flex-col items-center gap-4 justify-center ">
        <h1
          className={`w-full text-center text-destructive text-4xl font-black uppercase  ${bodoni.className}`}
        >
          Something went wrong
        </h1>
        <h2
          className={`w-full text-center text-white text-2xl font-bold  ${bodoni.className}`}
        >
          {error.message}
        </h2>
        <Button
          onClick={refreshHandler}
        >
          Try Again
        </Button>
        <FuzzyOverlay/>
      </main>
    );
}
export default ErrorPage;