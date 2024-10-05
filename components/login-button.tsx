"use client"
import {FC} from "react"
import { Button } from "@/components/ui/button"
import {LoginForm} from "@/components/auth/login-form";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"

export const LoginButton: FC =()=> {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button  size="lg">Sign in</Button>
      </DialogTrigger>
      <DialogContent className="w-full  md:max-w-[400px]    flex items-center justify-center  ">
        <LoginForm/>
      </DialogContent>
    </Dialog>
   
  )
}
