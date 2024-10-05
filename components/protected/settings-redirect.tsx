'use client'
import {FC, useEffect} from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { LoaderParentComponent } from "@/components/loader-parent-component";
export const SettingsRedirect:FC = () => {
    const router = useRouter();
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      await signOut(); 

      router.push("/auth/login"); 
  };
  useEffect(() => {
    router.push('/settings/general');  
  }, [router]);
  return (
    <LoaderParentComponent/>
  )
}

