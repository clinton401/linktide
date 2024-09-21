"use client";
import { FC, useState, useEffect } from "react";
import { CardWrapper } from "@/components/card-wrapper";
import { ResetSchema } from "@/schemas";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useCountdown } from "@/hooks/use-countdown";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { RegenerateButton } from "@/components/regenerate-button";
import { LoadingButton } from "@/components/loading-button";
import {regenerateResetVerificationCode} from "@/actions/regenerate-reset-verification-code";
import useGetRedirectUrl from "@/hooks/use-get-redirect-url";
import {reset} from "@/actions/reset"
export const ResetForm: FC = () => {
  const [isPending, setIsPending] = useState(false);
  const [isNewEmailPending, setIsNewEmailPending] = useState(false);
  const [error, setError] = useState<undefined | string>(undefined);
  const [success, setSuccess] = useState<undefined | string>(undefined);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const {
    isNewClicked: isResendClicked,
    setIsNewClicked: setIsResendClicked,
    countdown: resetCounter,
  } = useCountdown();
  const redirect = useGetRedirectUrl();
  const [isTyping, setIsTyping] = useState(false);
  const { push } = useRouter();
  const form = useForm<z.infer<ReturnType<typeof ResetSchema>>>({
    resolver: zodResolver(ResetSchema(isCodeSent)),
    defaultValues: {
      email: "",
      otp: isCodeSent ? "" : undefined,
      newPassword: isCodeSent ? "" : undefined,
    },
  });
  useEffect(() => {
    if(isTyping && error ) {
      setError(undefined);
      setSuccess(undefined);
    }
  }, [isTyping, error]);
  const onSubmit = async(values: z.infer<ReturnType<typeof ResetSchema>>) => {
 try{
  setIsPending(true);
  setError(undefined); 
  setSuccess(undefined);
  const data = await reset(values, isCodeSent, redirect);
  const {error, success, redirectUrl, isOtpSent} = data;

    setError(error); 

  
    setSuccess(success); 
    if(isOtpSent) {
      setIsCodeSent(true);
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
    
  };
  const regenerateCode = async() => {
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
     const data =  await  regenerateResetVerificationCode(emailValue);
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
  }
  return (
    <CardWrapper
      backButtonUrl={`/auth/login${redirect ? `?redirect=${encodeURIComponent(redirect)}`: ""}`}
      headerText="Forgot your password?"
      backButtonLinkText="Back to login"
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
                    disabled={isCodeSent || isPending}
                    onInput={() => setIsTyping(true)}
                    type="email"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          {isCodeSent && (
            <>
              {" "}
              <FormField
                control={form.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Verification code</FormLabel>
                    <FormControl>
                      <Input placeholder="******" onInput={() => setIsTyping(true)} disabled={isPending} {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New password</FormLabel>
                    <FormControl>
                      <Input placeholder="******" type="password" onInput={() => setIsTyping(true)} disabled={isPending} {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}
           {error && <FormError message={error}/>}
        {success && <FormSuccess message={success} />}
 <LoadingButton message={isCodeSent ? "Confirm" : "Verify"} isPending={isPending || isNewEmailPending}/>
        
        </form>
      </Form>
      {isCodeSent &&  <div className="w-full gap-4 flex flex-col justify-center items-center pt-4">
        <p className="text-xs w-full text-center ">Didn&apos;t send code yet?</p>

    <RegenerateButton isNewEmailPending={isNewEmailPending || isPending} isResendClicked={isResendClicked} resendCode={regenerateCode} resetCounter={resetCounter} />
   
    </div>}
    </CardWrapper>
  );
};

export default ResetForm;
