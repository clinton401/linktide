"use client"
import {FC} from "react";
import {CardWrapper} from "@/components/card-wrapper"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
 import {RegisterSchema} from "@/schemas"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
export const RegisterForm: FC = () => {
    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
          email: "",
          password: "",
          name: ""
        },
      });
      function onSubmit(values: z.infer<typeof RegisterSchema>) {
    
        console.log(values)
      }
    
    return (
        <CardWrapper  backButtonText="Already have an account?" backButtonUrl="/auth/login" headerText="Create an account" showSocial
        backButtonLinkText="Sign in" >
              <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="janesmith@example.com " type="email" {...field} />
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
                <Input placeholder="Jane smith "  {...field} />
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
                <Input placeholder="******" type="password" {...field} />
              </FormControl>
           
              <FormMessage />
            </FormItem>
          )}
        />
        <span className="flex items-center justify-end">
           <Button  size="sm"
                      variant="link"
                      asChild
                      className="px-0 font-normal">
                    <Link
                     
                      href="/auth/reset"
                    >
                      Forgot Password
                    </Link>
                  </Button>
           </span>
         <Button type="submit"  className="w-full">
         Create account
          </Button>
      </form>
    </Form>
        </CardWrapper>
    )

}