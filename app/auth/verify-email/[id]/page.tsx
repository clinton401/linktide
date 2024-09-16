import {FC} from 'react'
import {VerifyEmailForm} from "@/components/auth/verify-email-form"
export const metadata = {
    title: 'Verify your email', 
    description: "Verify your email to complete your Linktide account setup. Stay connected to manage and track your social media accounts across platforms.",
  };
const VerifyEmailPage: FC = () => {
  return (
    <VerifyEmailForm/>
  )
}

export default VerifyEmailPage
