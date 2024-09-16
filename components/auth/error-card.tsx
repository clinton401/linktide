
import {CardWrapper} from "@/components/card-wrapper"
import {FormError} from "@/components/form-error"
import {FC} from "react"
export const ErrorCard: FC = () => {
    return (
    <CardWrapper headerText="Oops Something went wrong" backButtonLinkText="Back to login" backButtonUrl="/auth/login">
        <FormError message="Sign in unsuccessful" />
    </CardWrapper>

    )
}