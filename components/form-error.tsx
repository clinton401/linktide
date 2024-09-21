import { FC } from "react";
import { FormErrorText } from "@/components/form-error-text";

type FormErrorProps = {
  message: string | {
    email?: string;
    password?: string;
    name?: string;
  } | undefined;
};

function isObject(value: unknown): value is Record<string, string | undefined> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  }

export const FormError: FC<FormErrorProps> = ({ message }) => {
  if (!message) return null;

  return (
    <>
      {typeof message === 'string' ? (
        <FormErrorText message={message} />
      ) : isObject(message) ? (
        <>
          {message.name && <FormErrorText message={message.name} />}
          {message.email && <FormErrorText message={message.email} />}
          {message.password && <FormErrorText message={message.password} />}
        </>
      ) : null}
    </>
  );
};
