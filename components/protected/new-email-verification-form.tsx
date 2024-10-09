"use client"
import {CardWrapper} from "@/components/card-wrapper"
import {FormError} from "@/components/form-error";
import {FormSuccess} from "@/components/form-success";
import {FC, useEffect, useState} from "react"
import { useParams } from 'next/navigation';
import {verifyNewEmail} from "@/actions/verify-new-email"
import {MiniLoader} from "@/components/mini-loader";
import { useSession } from 'next-auth/react';

export const NewEmailVerificationForm: FC = () => {
    const [error, setError] = useState<undefined | string>(undefined);
    const [success, setSuccess] = useState<undefined | string>(undefined);
    const [isPending, setIsPending] = useState(true);
    const {id} = useParams();
    
const { data: session, update } = useSession();
const verificationHandler = async() => {
    const userId = Array.isArray(id) ? id[0] : id;
    if(!userId || typeof userId !== "string" ) {
      setError("Invalid user ID");
      
      setSuccess(undefined);
      return ;
    }
    try{
        setIsPending(true);
        const data = await verifyNewEmail(userId);
        const {error, success, new_email} = data;
        setError(error); 
    
        setSuccess(success); 
        if (new_email && session && update) {
            update({ ...session, user: { ...session.user, email: new_email } });

          }
        
    }catch(err) {
        console.error(error)
        setSuccess(undefined);
        setError("An unexpected error occurred.");
    } finally{
        setIsPending(false)
    }
}
    useEffect(() => {
        verificationHandler()
    }, [id])
    
return (
    <CardWrapper headerText="Verify new email" backButtonLinkText="Back to Profile" backButtonUrl="/settings">
        {isPending && <div className="w-full flex items-center justify-center"><MiniLoader idNeeded={true}/></div>}
        {
            error && <FormError message={error} />
        }
        {
            success && <FormSuccess message={success} />
        }
        
    </CardWrapper>
)
}