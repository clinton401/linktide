"use client";
import { FC, useState } from "react";
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
import { Button } from "@/components/ui/button";
export const ResetForm: FC = () => {
  const [isCodeSent, setIsCodeSent] = useState(false);
  const form =  useForm<z.infer<ReturnType<typeof ResetSchema>>>({
    resolver: zodResolver(ResetSchema(isCodeSent)),
    defaultValues: {
      email: "",
      otp: isCodeSent ? "" : undefined,
      newPassword: isCodeSent ? "" : undefined,
    },
  });
  const onSubmit = (values: z.infer<ReturnType<typeof ResetSchema>>) => {
    console.log(values);
    setIsCodeSent(!isCodeSent)
  };
  return (
    <CardWrapper
      backButtonUrl="/auth/login"
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
                    disabled={isCodeSent}
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
                      <Input placeholder="******" {...field} />
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
                      <Input placeholder="******" type="password" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}
          <Button type="submit" className="w-full">
            {isCodeSent ? "Confirm":"Verify"}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default ResetForm;
