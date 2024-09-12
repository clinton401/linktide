
import { FC } from "react";
import {FormErrorText} from "@/components/form-error-text"
type FormErrorProps = {
    message: string | {
        email?: string | undefined;
        password?: string | undefined;
        name?: string | undefined;
    } | undefined;
};


function isObject(value: any): value is Record<string, any> {
    return value  && typeof value === 'object' && !Array.isArray(value);
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
