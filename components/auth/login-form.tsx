"use client";
import { FC, useState } from "react";
import { CardWrapper } from "@/components/card-wrapper";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { LoginSchema } from "@/schemas";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useGetRedirectUrl from "@/hooks/use-get-redirect-url";
import { useRouter } from "next/navigation";
import { useCountdown } from "@/hooks/use-countdown";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { RegenerateButton } from "@/components/regenerate-button";
import { LoadingButton } from "@/components/loading-button";
import {regenerate2faVerificationCode} from "@/actions/regenerate-2fa-verification-code";
import {login} from "@/actions/login"
export const LoginForm: FC = () => {
  const [is2FA, setIs2FA] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [isNewEmailPending, setIsNewEmailPending] = useState(false);
  const [error, setError] = useState<undefined | string>(undefined);
  const [success, setSuccess] = useState<undefined | string>(undefined);
  const {
    isNewClicked: isResendClicked,
    setIsNewClicked: setIsResendClicked,
    countdown: resetCounter,
  } = useCountdown();
  const {push } = useRouter();
  const redirect = useGetRedirectUrl();
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
      twoFA: is2FA ? "" : undefined,
    },
  });

 async function onSubmit(values: z.infer<typeof LoginSchema>) {
    
    try{
      setIsPending(true);
      setError(undefined); 
      setSuccess(undefined);
      const data = await login(values, redirect, is2FA);
      const {error, success, redirectUrl, isTwoFA} = data;
    console.log(data)
        setError(error); 
    
        setSuccess(success); 
        if(isTwoFA) {
          setIs2FA(true);
        }
     
      if(redirectUrl) {
        push(redirectUrl)
      }
     }catch(error) {
      setSuccess(undefined);
      setError("An unexpected error occurred.");
      console.error(error)
    } finally {
      setIsPending(false);
    }
  }
  const regenerateCode = async () => {
        const emailValue = form.watch('email');
        if(!emailValue || typeof emailValue !== "string" ) {
          setError("Invalid email");
          setSuccess(undefined);
          return ;
        }
        try{
          setIsNewEmailPending(true);
          setIsResendClicked(false);
          setError(undefined);
          setSuccess(undefined);
         const data =  await  regenerate2faVerificationCode(emailValue);
         const {error, success} = data;
         setError(error);
         setSuccess(success);
      if(success) {
        setIsNewEmailPending(false);
        setIsResendClicked(true);
      } else {
        setIsNewEmailPending(false);
        setIsResendClicked(false);
      }
        } catch(error){
    console.error(error);
    setIsNewEmailPending(false);
    setIsResendClicked(false);
    }
  };
  return (
    <CardWrapper
      backButtonText="Don&apos;t have an account?"
      backButtonUrl={`/auth/register${
        redirect ? `?redirect=${encodeURIComponent(redirect)} ` : ""
      }`}
      headerText="Welcome back"
      showSocial
      backButtonLinkText="Sign up"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="janesmith@example.com "
                    disabled={isPending || is2FA}
                    type="email"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="******"
                    disabled={isPending || is2FA}
                    type="password"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          {is2FA && (
            <FormField
              control={form.control}
              name="twoFA"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Two-Factor Authentication Code</FormLabel>
                  <FormControl>
                    <Input placeholder="******" disabled={isPending } {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <div className="flex items-center justify-end w-full">
            <Button
              size="sm"
              variant="link"
              asChild
              className="px-0 font-normal"
            >
              <Link
                href={`/auth/reset${
                  redirect ? `?redirect=${encodeURIComponent(redirect)} ` : ""
                }`}
              >
                Forgot Password
              </Link>
            </Button>
          </div>
          {error && <FormError message={error}/>}
          {success && <FormSuccess message={success} />}
          <LoadingButton
            message={"Login"}
            isPending={isPending || isNewEmailPending}
          />
        </form>
      </Form>
      {is2FA && (
        <div className="w-full gap-4 flex flex-col justify-center items-center pt-4">
          <p className="text-xs w-full text-center">Didn&apos;t send code yet?</p>
          <RegenerateButton
            isNewEmailPending={isNewEmailPending || isPending}
            isResendClicked={isResendClicked}
            resendCode={regenerateCode}
            resetCounter={resetCounter}
          />
        </div>
      )}
    </CardWrapper>
  );
};
