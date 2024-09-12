import {FC} from 'react'
import {ResetForm} from "@/components/auth/reset-form"
export const metadata = {
    title: 'Reset your password', 
    description: "Reset your Linktide password to regain access to seamless social media management. Securely update your credentials and get back to managing your accounts.",
  };
const ResetPage: FC = () => {
  return (
    <ResetForm/>
  )
}

export default ResetPage
