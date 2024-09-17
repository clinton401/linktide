"use client"
import {FC} from 'react'
import {FcGoogle} from "react-icons/fc"
import {FaGithub} from "react-icons/fa"
import {Button} from "@/components/ui/button"
import {signIn} from "next-auth/react"
import { DEFAULT_LOGIN_REDIRECT } from '@/routes'
import useGetRedirectUrl from "@/hooks/use-get-redirect-url";
export const Social: FC = () => {
  const redirect = useGetRedirectUrl();
  const onClick = (provider: "google"|"github") => {
    

    signIn(provider, {
      callbackUrl: redirect ? redirect : DEFAULT_LOGIN_REDIRECT
    })

  }
  return (
    <div className="flex items-center w-full gap-x-2">
<Button size="lg" className="w-full" variant="outline" onClick={() => onClick("google")} >
    <FcGoogle className="h-5 aspect-square"/>
</Button>
<Button size="lg" className="w-full" variant="outline" onClick={() => onClick("github")} >
    <FaGithub className="h-5 aspect-square"/>
</Button>

    </div>
  )
}
