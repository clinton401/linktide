"use client"
import {FC, ReactNode} from 'react'
import {Button} from "@/components/ui/button"
import { Roboto_Slab } from 'next/font/google';

import {ModeToggle} from "@/components/mode-toggle"
const roboto = Roboto_Slab({ subsets: ["latin"], weight: ["300" , "400" , "500" , "600" , "700" , "800", "900"] });
import Link from "next/link"
type AnalyticsProps = {
    children: ReactNode,
    icon:  any,
    name: string,
    redirectUrl: string
}
export const AnalyticsParentComponent: FC<AnalyticsProps> = ({icon, name, redirectUrl, children}) => {
    const isAuthenticated = false;
    if(!isAuthenticated) return <section className='w-full px-[5%] min-h-dvh flex flex-col gap-4 items-center justify-center'>
        <ModeToggle/>
        <h2 className={`font-semibold text-2xl w-full  lg:w-3/4 ${roboto.className} text-center`}>You need to be logged in to view this content. Please log in to your account to continue.</h2>
        <Button asChild className='flex items-center ' >
            <Link href={redirectUrl}>Login with {name} {icon}</Link>

        </Button>
    </section>
  return (
    <section className="w-full">
        {children}
    </section>
  )
}
