import {CheckCircledIcon} from "@radix-ui/react-icons"
import {FC} from "react"
type FormSuccessProps = {
    message : string | undefined
}


export const FormSuccess: FC<FormSuccessProps>=({
    message
}) => {
if(!message) return null
return (
    <div className="bg-emerald-500/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-emerald-500">
<CheckCircledIcon className="aspect-square h-4"/>
<p>{message}</p>
    </div>
)
}