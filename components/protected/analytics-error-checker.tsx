"use client"
import {FC, ReactNode, useEffect, useState} from 'react'
import { ErrorComp } from '@/components/error-comp';
import { useSearchParams, useRouter } from 'next/navigation';
export const AnalyticsErrorChecker: FC<{children: ReactNode}> = ({children}) => {
    const [isError, setIsError] = useState<undefined | string>(undefined);
    const searchParams = useSearchParams();
  const error = searchParams.get('error');
  useEffect(() => {
    const hasError = error ? error : undefined;
    setIsError(hasError)
  }, [error]);
  if(isError) {
    return <ErrorComp message={isError} />
  }
  return (
    <>
    {children}
    </>
  )
}
