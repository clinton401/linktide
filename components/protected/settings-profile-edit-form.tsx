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
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { LoadingButton } from "@/components/loading-button";
import { ProfileEditSchema } from "@/schemas";
import logo from "../../public/assets/logo.png";
import { Images } from "@/components/images";
import { editProfile } from "@/actions/edit-profile";
import { bodoni } from "@/lib/fonts";
// import { useCurrentUser } from "@/hooks/use-current-user";
import type { UserSession } from "@/components/protected/create-post-ui";
export const SettingsProfileEditForm: FC<{session: UserSession}> = ({session}) => {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<undefined | string>(undefined);
  const [success, setSuccess] = useState<undefined | string>(undefined);
  // const session = useCurrentUser();
  const { push, refresh } = useRouter();
  const form = useForm<z.infer<typeof ProfileEditSchema>>({
    resolver: zodResolver(ProfileEditSchema),
    defaultValues: {
      name: undefined,
      email: undefined,
    },
  });
  useEffect(() => {
    if (!session) {
      push("/auth/login");
    }
  }, [session]);
  async function onSubmit(values: z.infer<typeof ProfileEditSchema>) {
    const nameValue = form.watch("name");
    const emailValue = form.watch("email");

    if (!nameValue && !emailValue) {
      setError("At least one of 'name' or 'email' must be provided");
      setSuccess(undefined);
      return;
    }
    try {
      setIsPending(true);
      setError(undefined);
      setSuccess(undefined);

      const data = await editProfile(values);
      const { error, success, redirectUrl } = data;
      setError(error);

      setSuccess(success);

      if (success) {
        refresh();
       form.reset({
        name: undefined,
        email: undefined,
        });
      }
      if (redirectUrl) {
        push(redirectUrl);
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Jane Smith"
                      disabled={isPending}
                      type="name"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            {session?.oauth?.length === 0 && (
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="janesmith@example.com "
                        disabled={isPending}
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      To update your email, a verification link will be sent to
                      your new email address. The email will only be changed
                      once the new email is confirmed.
                    </FormDescription>
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
