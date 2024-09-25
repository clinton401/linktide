"use client"
import {FC} from 'react'
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { useCurrentUser } from '@/hooks/use-current-user';
 const Settings: FC = () => {
    const session = useCurrentUser();
    const router = useRouter();
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      await signOut(); 

      router.push("/auth/login"); 
  };
  return (
    <div>
    <div>{JSON.stringify(session)}</div>
    <form onSubmit={handleSubmit}><button type="submit">Sign out</button></form></div>
  )
}
 

export default Settings
