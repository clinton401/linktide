import {auth} from "@/auth";

export const getServerUser = async() => {
    const session = await auth();
    return session?.user;
}  