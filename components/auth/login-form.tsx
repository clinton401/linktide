"use client"
import {FC} from "react";
import {CardWrapper} from "@/components/card-wrapper"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
 import {LoginSchema} from "@/schemas"
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
export const LoginForm: FC = () => {
    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
          email: "",
          password: ""
        },
      });
      function onSubmit(values: z.infer<typeof LoginSchema>) {
    
        console.log(values)
      }
    
    return (
        <CardWrapper  backButtonText="Don't have an account?" backButtonUrl="/auth/register" headerText="Welcome back" showSocial
        backButtonLinkText="Sign up" >
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
       <div className="flex items-center justify-end w-full">
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
       </div>
         <Button type="submit"  className="w-full">
            Login
          </Button>
      </form>
    </Form>
        </CardWrapper>
    )

}