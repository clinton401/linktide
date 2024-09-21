import { useRouter, useSearchParams } from "next/navigation";

export const useDeleteQuery = (key: string) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  return () => {
        const params = new URLSearchParams(searchParams.toString());
        console.log(`param key1: ${params}`);
        params.delete(key);
  console.log(`param key2: ${params}`);
        const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ""}`;
        console.log(newUrl)
        router.replace(newUrl);
      
  };
};
