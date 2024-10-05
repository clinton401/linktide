"use client"
import {FC, ReactNode} from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CiEdit } from "react-icons/ci";
type EditProps = {
    children: ReactNode
}

export const SettingsEditButton: FC<EditProps> =({
    children
})=> {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button  size="sm" variant="outline" className="rounded-full">Edit <CiEdit className="ml-1"/> </Button>
        </DialogTrigger>
        <DialogContent className="w-full  md:max-w-[400px]    flex items-center justify-center  ">
   
       {children}
        </DialogContent>
      </Dialog>
     
    )
  }