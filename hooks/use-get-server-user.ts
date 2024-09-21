import {auth} from "@/auth";

export const useGetServerUser = async() => {
    const session = await auth();
    return session?.user;
}  