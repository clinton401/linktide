import { FC } from "react";
type LoaderProps = {
  idNeeded?: boolean
}
export const MiniLoader: FC<LoaderProps> = ({idNeeded = false}) => {
  return (
<div className="leap-frog" id={idNeeded? "leap-frog": ""}>
<div className="leap-frog__dot"></div>
<div className="leap-frog__dot"></div>
<div className="leap-frog__dot"></div>
</div>
  );
};
