"use client";
import { FC, useState, useEffect } from "react";
import { CardWrapper } from "@/components/card-wrapper";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { RegisterSchema } from "@/schemas";
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
import {LoadingButton} from "@/components/loading-button";
import {register} from "@/actions/register";
import {useRouter} from "next/navigation";

import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
export const RegisterForm: FC = () => {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<undefined | Record<string, string | undefined>| string>(undefined);
  const [success, setSuccess] = useState<undefined | string>(undefined);
  const [isTyping, setIsTyping] = useState(false);
  const {push} = useRouter();
  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });
  useEffect(() => {
    if(isTyping && error ) {
      setError(undefined)
    }
  }, [isTyping]);
  async function onSubmit(values: z.infer<typeof RegisterSchema>) {
    try{
      setIsPending(true);
      setError(undefined); 
      setSuccess(undefined);
      const data = await register(values);
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
  return (
    <CardWrapper
      backButtonText="Already have an account?"
      backButtonUrl="/auth/login"
      headerText="Create an account"
      showSocial
      backButtonLinkText="Sign in"
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
                  <Input  disabled={isPending} onInput={() => setIsTyping(true)}
                    placeholder="janesmith@example.com "
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input  disabled={isPending} onInput={() => setIsTyping(true)} placeholder="Jane smith " {...field} />
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
                  <Input  disabled={isPending} onInput={() => setIsTyping(true)} placeholder="******" type="password" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <span className="flex items-center justify-end">
            <Button
              size="sm"
              variant="link"
              asChild
              className="px-0 font-normal"
            >
              <Link href="/auth/reset">Forgot Password</Link>
            </Button>
          </span>
          {error && <FormError message={error}/>}
          {success && <FormSuccess message={success} />}
       <LoadingButton isPending={isPending} message="Create account"/>
        </form>
      </Form>
    </CardWrapper>
  );
};
