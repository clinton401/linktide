"use client"
import {FC} from 'react';
import { bodoni } from '@/lib/fonts';
import { Button } from '@/components/ui/button';
import { useDeleteQuery } from "@/hooks/use-delete-query";
export const ErrorComp: FC<{message: string}> = ({message}) => {
    const deleteQuery = useDeleteQuery("error");
    const refreshHandler = () => {
     
        deleteQuery();
      }
  return (
    <section className=" min-h-dvh  overflow-hidden relative py-4 px-p-half flex flex-col items-center gap-4 justify-center ">
    <h1
      className={`w-full text-center text-destructive text-4xl font-black uppercase  ${bodoni.className}`}
    >
      Something went wrong
    </h1>
    <h2
      className={`w-full text-center text-white text-2xl font-bold  ${bodoni.className}`}
    >
      {message}
    </h2>
    <Button
      onClick={refreshHandler}
    >
      Try Again
    </Button>
  </section>
  )
}
