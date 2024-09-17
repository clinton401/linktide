import { useSearchParams } from 'next/navigation';

const useGetRedirectUrl = () => {
    const searchParams = useSearchParams();
    const redirect = searchParams.get('redirect');
    return redirect;
}
export default useGetRedirectUrl;