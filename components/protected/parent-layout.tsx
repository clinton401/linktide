import {FC, ReactNode} from "react"
import { Navbar } from "@/components/protected/navbar"
type ParentLayoutProps = {
    children: ReactNode
}
export const ParentLayout: FC<ParentLayoutProps> = ({
    children
}) => {
    return(
        <main className="w-full min-h-dvh  bg-background md:pl-[76px]" id="protected">
            <Navbar/>
            {children}
        </main>
    )
}