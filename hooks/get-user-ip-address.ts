"use server";
import { headers } from "next/headers";

const getUserIpAddress = async () => {
    const header = await headers();  
    const ip = header.get("x-forwarded-for") ?? "unknown";  
    return ip;
};
export default getUserIpAddress;