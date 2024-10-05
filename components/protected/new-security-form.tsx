"use client";
import { FC, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { LoadingButton } from "@/components/loading-button";
import { SecuritySchema } from "@/schemas";
import logo from "../../public/assets/logo.png";
import { Images } from "@/components/images";
import { newSecurity } from "@/actions/new-security";
import { bodoni } from "@/lib/fonts";

import type { UserSession } from "@/components/protected/create-post-ui";
import { Switch } from "@/components/ui/switch";
export const NewSecurityForm: FC<{ session: UserSession }> = ({ session }) => {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<undefined | string>(undefined);
  const [success, setSuccess] = useState<undefined | string>(undefined);
  //   const session = useCurrentUser();
  const { push, refresh } = useRouter();
  console.log(session);
  useEffect(() => {
    if (!session) {
      push("/auth/login");
    }
  }, [session]);
  const form = useForm<z.infer<typeof SecuritySchema>>({
    resolver: zodResolver(SecuritySchema),
    defaultValues: {
      twoFA: session && session["2FA"] === true ? true : false,
      newPassword: undefined,
    },
  });
  async function onSubmit(values: z.infer<typeof SecuritySchema>) {
    const twoFaValue = form.watch("twoFA");
    const newPasswordValue = form.watch("newPassword");
    if (twoFaValue === undefined && !newPasswordValue) {
      setError("At least one of the fields must be provided");
      setSuccess(undefined);
      return;
    }
    try {
      setIsPending(true);
      setError(undefined);
      setSuccess(undefined);

      const data = await newSecurity(values);
      const { error, success } = data;
      setError(error);

      setSuccess(success);

      if (success) {
        refresh();
        form.reset({
          twoFA: session && session["2FA"] === true ? true : false,
          newPassword: undefined,
        });
      }
    } catch (error) {
      console.error(error);
      setSuccess(undefined);
      setError("An unexpected error occurred.");
    } finally {
      setIsPending(false);
    }
  }
  return (
    <Card className=" w-full max-w-[350px]">
      <CardHeader className="flex flex-col *:text-center items-center justify-center ">
        <CardTitle
          className={`font-black flex items-center justify-center  ${bodoni.className} text-3xl`}
        >
          Linktide
          <span className="relative w-[30px] aspect-square overflow-hidden ml-2">
            <Images imgSrc={logo} alt="website logo" />
          </span>
        </CardTitle>
        <CardDescription>Edit your profile details</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="twoFA"
              render={({ field }) => (
                <FormItem className="w-full flex items-center justify-between gap-x-2 gap-y-4 flex-wrap ">
                  <FormLabel>2FA</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            {session?.isPasswordAvailable === true && (
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="****** "
                        disabled={isPending}
                        type="password"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {error && <FormError message={error} />}
            {success && <FormSuccess message={success} />}
            <LoadingButton message={"Edit"} isPending={isPending} />
          </form>
        </Form>
      </CardContent>

      {/* <CardFooter className="flex justify-center items-center">
        <Button variant="outline" onClick={() => refresh()}>
            Go back
        </Button>
      </CardFooter> */}
    </Card>
  );
};
