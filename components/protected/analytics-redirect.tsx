'use client'
import {FC, useEffect} from 'react';
import { useRouter } from 'next/navigation';
import { LoaderParentComponent } from "@/components/loader-parent-component";
export const AnalyticsRedirect:FC = () => {
    const router = useRouter();

  useEffect(() => {
    router.push('/analytics/facebook');  
  }, [router]);
  return (
    <LoaderParentComponent/>
  )
}

