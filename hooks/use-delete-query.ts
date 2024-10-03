import { useRouter, useSearchParams } from "next/navigation";

export const useDeleteQuery = (key: string) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  return () => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete(key);
        const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ""}`;
        router.replace(newUrl);
      
  };
};
