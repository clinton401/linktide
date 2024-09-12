import {FC} from "react";
import {LoginForm} from "@/components/auth/login-form";
export const metadata = {
    title: 'Login', 
    description: "Log in to Linktide to manage and track all your social media accounts in one place. Post across platforms and view real-time analytics with ease.",
  };
  
const LoginPage: FC = () => {
    return (
       
       <LoginForm/>


    )
}

export default LoginPage