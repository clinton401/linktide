'use client'
import {FC, useEffect} from 'react';
import { useRouter } from 'next/navigation';

export const AnalyticsRedirect:FC = () => {
    const router = useRouter();

  useEffect(() => {
    router.push('/analytics/facebook');  // Client-side redirect
  }, [router]);
  return (
    <>
      
    </>
  )
}

