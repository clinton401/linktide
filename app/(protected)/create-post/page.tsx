import { FC } from "react";
import {CreatePostUI} from "@/components/protected/create-post-ui"
const CreatePostPage: FC = () => {
  return (
    <div className="w-full flex flex-wrap gap-x-4 md:gap-x-0 justify-center    ">
      
     <CreatePostUI/>
    </div>
  );
};
export default CreatePostPage;
