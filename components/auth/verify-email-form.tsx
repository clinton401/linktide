"use client";
import { FC, useState } from "react";
import { CardWrapper } from "@/components/card-wrapper";
import { OtpSchema } from "@/schemas";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { LoadingButton } from "@/components/loading-button";
import {verifyEmail} from "@/actions/verify-email"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
  } from "@/components/ui/input-otp"
  import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp"
  import { useParams, useRouter } from 'next/navigation';
  
import useGetRedirectUrl from "@/hooks/use-get-redirect-url";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import {useCountdown} from "@/hooks/use-countdown";
import {regenerateEmailVerificationCode} from "@/actions/regenerate-email-verification-code";
import {RegenerateButton} from "@/components/regenerate-button";
export const VerifyEmailForm: FC = () => {
  const [isPending, setIsPending] = useState(false);
  const [isNewEmailPending, setIsNewEmailPending] = useState(false);
  const [error, setError] = useState<undefined | string>(undefined);
  const [success, setSuccess] = useState<undefined | string>(undefined);
  const {id} = useParams();
  const  { isNewClicked: isResendClicked, setIsNewClicked: setIsResendClicked, countdown: resetCounter } = useCountdown();
  const redirect = useGetRedirectUrl();
  const {push} = useRouter();
    const form = useForm<z.infer<typeof OtpSchema>>({
        resolver: zodResolver(OtpSchema),
        defaultValues: {
          otp: "",
        },
      })
     async function onSubmit(values: z.infer<typeof OtpSchema>) {
      const userId = Array.isArray(id) ? id[0] : id;
        if(!userId || typeof userId !== "string" ) {
          setError("Invalid user ID");
          
          setSuccess(undefined);
          return ;
        }
        try{
          setIsPending(true);
          setError(undefined); 
          setSuccess(undefined);
          const data = await verifyEmail(values, userId, redirect);
          const {error, success, redirectUrl} = data;
      
            setError(error); 
     
          
            setSuccess(success); 
         
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
      
      async function resendCode () {
        const userId = Array.isArray(id) ? id[0] : id;
        if(!userId || typeof userId !== "string" ) {
          setError("Invalid user ID");
          
          setSuccess(undefined);
          return ;
        }
        try{
          setIsNewEmailPending(true);
          setIsResendClicked(false);
          setError(undefined); 
          setSuccess(undefined);
         const data =  await  regenerateEmailVerificationCode(userId, redirect);
         const {error, success, redirectUrl} = data;
      
         setError(error); 
  
       
         setSuccess(success); 
         if(redirectUrl) {
          push(redirectUrl)
        }
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
    backButtonUrl={`/auth/login${redirect ? `?redirect=${encodeURIComponent(redirect)} `: ""}`} 
      headerText="Verify your email"
      backButtonLinkText="Back to login"
    >
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-4">
        <FormField
          control={form.control}
          name="otp"
          render={({ field }) => (
            <FormItem>
              
              <FormControl >
                <div className="w-full flex items-center justify-center ">
                <InputOTP maxLength={6} {...field} pattern={REGEXP_ONLY_DIGITS_AND_CHARS}>
                <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
                </InputOTP>
                </div>
              </FormControl>
              <FormDescription className="w-full text-center">
                Please enter the one-time password sent to your email.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {error && <FormError message={error}/>}
        {success && <FormSuccess message={success} />}
 <LoadingButton message="Verify" isPending={isPending || isNewEmailPending}/>

 
      </form>
    </Form>
    <div className="w-full gap-4 flex flex-col justify-center items-center pt-4">
    <p className="text-xs w-full text-center ">Didn&apos;t send code yet?</p>

    <RegenerateButton isNewEmailPending={isNewEmailPending || isPending} isResendClicked={isResendClicked} resendCode={resendCode} resetCounter={resetCounter} />
   
    </div>
    
    </CardWrapper>
  )
}

