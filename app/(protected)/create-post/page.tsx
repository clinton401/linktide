import { FC } from "react";
import {CreatePostUI} from "@/components/protected/create-post-ui"
import { getServerUser } from "@/hooks/get-server-user";
export const metadata = {
  title: 'Create Post',
  description: "Craft and share posts directly to your social media accounts using Linktide. Easily manage content across platforms from one place.",
};

const CreatePostPage: FC = async() => {
  const session = await getServerUser();
  return (
    <div className="w-full flex flex-wrap gap-x-4 md:gap-x-0 justify-center    ">
      
     <CreatePostUI session={session}/>
    </div>
  );
};
export default CreatePostPage;
