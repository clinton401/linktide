import { useCurrentUser } from "@/hooks/use-current-user";
import { useGetServerUser } from "./use-get-server-user";
import type { ISocial } from "@/models/social-media-schema";
export const useGetSocialMediaDetails = async(name: string): Promise<ISocial | undefined> => {
    const session = await useGetServerUser();

    
    if (!session || !session.socialMedia) {
        return undefined; 
    }

    const platform = session.socialMedia.find(app => app.name === name);
    return platform;
};
