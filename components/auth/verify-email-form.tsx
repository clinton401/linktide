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
  FormLabel,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
  } from "@/components/ui/input-otp"
export const VerifyEmailForm: FC = () => {
    const form = useForm<z.infer<typeof OtpSchema>>({
        resolver: zodResolver(OtpSchema),
        defaultValues: {
          otp: "",
        },
      })
      function onSubmit(values: z.infer<typeof OtpSchema>) {
       console.log(values)
      }
  return (
    <CardWrapper
      backButtonUrl="/auth/login"
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
                <InputOTP maxLength={6} {...field} >
                  <InputOTPGroup autoFocus>
                    <InputOTPSlot index={0}  autoFocus={true}/>
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
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
 
 <Button type="submit"  className="w-full">
            Verify
          </Button>
      </form>
    </Form>
    </CardWrapper>
  )
}

