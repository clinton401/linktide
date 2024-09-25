"use client";
import { FC, ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";

import { ModeToggle } from "@/components/mode-toggle";
import { bodoni } from "@/lib/fonts";
import axios from "axios";
import { MiniLoader } from "@/components/mini-loader";
type AnalyticsProps = {
  icon: ReactNode;
  name: string;
  redirectUrl: string;
};
export const AnalyticsParentComponent: FC<AnalyticsProps> = ({
  icon,
  name,
  redirectUrl,
}) => {
  const [error, setError] = useState<undefined | string>(undefined);
  const [isPending, setIsPending] = useState(false);
  const authenticateUser = async() => {
    try{
        setIsPending(true);
        const response = await axios.get(redirectUrl, {
            headers: {
              'Content-Type': 'application/json',
            },
          }); 
           const { redirectTo } = response.data;

          if (redirectTo) {
            window.location.href = redirectTo;
          } else {
            setError('Redirect URL is missing');
          }
      
    }catch(error) {

        if (axios.isAxiosError(error) && error.response) {
          
            const errorMessage = error.response.data?.error || `Error during ${name} authorization`;
            console.error(`Error during ${name} authorization:`, errorMessage);
            setError(errorMessage)
          } else {
            setError(`Error during ${name} authorization`)
            console.error(`Error during ${name} authorization:`, error);
          }
    } finally{
        setIsPending(false);
    }
  }
  if (error) {
    throw new Error(error);
  }

    return (
      <section className="w-full px-[5%] min-h-dvh pt-6 md:pt-4 flex flex-col gap-4 items-center justify-center">
        <ModeToggle />
        <h2
          className={`font-semibold text-2xl w-full  lg:w-3/4 ${bodoni.className} text-center`}
        >
          You need to be logged in to view this content. Please log in to your
          account to continue.
        </h2>

        {isPending ? (
          <Button disabled size="lg">
            <MiniLoader />
          </Button>
        ) : (
          <Button className="flex items-center " onClick={authenticateUser} disabled={false}>
            Login with {name} {icon}
          </Button>
        )}
      </section>
    );
};
