import {FC} from "react";

import { Loader } from "@/components/loader";

export const LoaderParentComponent: FC = () => {
    return (
<div className="w-full min-h-dvh flex items-center justify-center ">
      <Loader />
    </div>
    )
}