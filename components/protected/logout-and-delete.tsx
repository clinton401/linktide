"use client";
import { FC, useState } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { MiniLoader } from "@/components/mini-loader";
import { deleteAccount } from "@/actions/delete-account";
export const LogoutAndDelete: FC = () => {
  const [isLogoutPending, setIsLogoutPending] = useState(false);
  const [isDeletePending, setIsDeletePending] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const handleLogout = async () => {
    try {
      setIsLogoutPending(true);
      await signOut();
      toast({
        description: "You have logged out successfully.",
      });
      router.push("/auth/login");
    } catch (error) {
      console.error(`Unable to logout: ${error}`);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem trying to logout",
      });
    } finally {
      setIsLogoutPending(false);
    }
  };
  const handleDeletion = async () => {
    try {
      setIsDeletePending(true);
      const data = await deleteAccount();
      const { error, success, redirectUrl } = data;
      if (error) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: error,
        });
      }
      if (success) {
        await signOut();
        toast({
          description: success,
        });
        window.location.href="/auth/login"
        // router.push("/auth/login");
        
      }
      if (redirectUrl) {
        router.push(redirectUrl);
      }
    } catch (error) {
      console.error(`Unable to delete account: ${error}`);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem trying to Delete account",
      });
    } finally {
      setIsDeletePending(false);
    }
  };

  return (
    <section className="w-full gap-4 flex pt-4 items-center flex-wrap justify-center">
      <Button
        variant="secondary"
        className="min-w-[130px]"
        onClick={handleLogout}
        disabled={isLogoutPending || isDeletePending}
      >
        {isLogoutPending ? <MiniLoader /> : "Logout"}
      </Button>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            
            className="min-w-[130px]"
            disabled={isLogoutPending || isDeletePending}
          >
            {isDeletePending ? <MiniLoader /> : "Delete account"}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletion}>
              {isDeletePending ? <MiniLoader /> : "Continue"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
};
