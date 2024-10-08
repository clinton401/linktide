"use client"
import {FC, useState} from "react";
import {Button} from "@/components/ui/button";
import {MiniLoader} from "@/components/mini-loader";
import {platformLogout} from "@/actions/platform-logout";

import { useToast } from "@/hooks/use-toast";
export const PlatformLogoutButton: FC<{name: string}> = ({name}) => {
    const [isPending, setIsPending] = useState(false);
    const {toast} = useToast();
    const logoutHandler = async() => {

        try{
            setIsPending(false)
        }catch(error) {
            console.error("Error logginng out:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Unable to logout, please try again.",
      });
        }finally {
            setIsPending(true)
        }
const data = await platformLogout(name);
const {error, success} = data;
if(error) {
    toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error,
      });
} 
if(success) {
    toast({
        description: " Note: This may take a while. Thank you for your patience!",
      });
}
    }
    return (
        <Button disabled={isPending} onClick={logoutHandler} size="lg">
            {isPending ? <MiniLoader/>: `Logout of ${name}`}
        </Button>
    )
}
