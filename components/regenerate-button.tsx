import {FC} from 'react'
import {Button} from "@/components/ui/button";
import {MiniLoader} from "@/components/mini-loader"
type RegenerateProps = {
    isNewEmailPending: boolean;
    isResendClicked: boolean;
    resendCode: ()=> Promise<void>;
    resetCounter: number,
}
export const RegenerateButton: FC<RegenerateProps> = ({isNewEmailPending, isResendClicked, resendCode, resetCounter}) => {
  return (
    <Button  disabled={isNewEmailPending || isResendClicked } className={ `w-full`} variant={ "secondary"} onClick={resendCode}>

    { isNewEmailPending && <MiniLoader idNeeded={true}/>}
    {!isNewEmailPending && isResendClicked && <>{ resetCounter < 10 ? `00:0${resetCounter}` : `00:${resetCounter}`}</>}

{!isNewEmailPending && !isResendClicked && "Resend"}
      </Button>
  )
}
