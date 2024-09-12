import {FC} from "react";
import {RegisterForm} from "@/components/auth/register-form";
export const metadata = {
    title: 'Sign up', 
    description: "Sign up for Linktide to simplify your social media management. Connect multiple accounts, post seamlessly, and track your performance across platforms.",
  };

const RegisterPage: FC = () => {
    return (
        // <section className="absolute z-20 bg-none">
       <RegisterForm/>
    //    </section>
    )
}

export default RegisterPage