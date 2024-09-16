import {FC, ReactNode} from "react"
 import {bodoni} from "@/lib/fonts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import logo from "../public/assets/logo.png"
import {Images} from "@/components/images"
import {Social} from "@/components/auth/social"
import { CardBackButton } from "@/components/card-back-button"
type CardWrapperProps = {
children?: ReactNode,
backButtonText?: string,
backButtonLinkText: string,
backButtonUrl: string
headerText: string,
showSocial?: boolean
}

export const CardWrapper: FC<CardWrapperProps> =({
    children, backButtonText, backButtonUrl, headerText, showSocial = false,
    backButtonLinkText
}) => {
    return (
        <Card className=" w-full max-w-[350px]">
      <CardHeader className="flex flex-col *:text-center items-center justify-center ">
        <CardTitle className={`font-black flex items-center justify-center  ${bodoni.className} text-3xl`}>Linktide
          <span className="relative w-[30px] aspect-square overflow-hidden ml-2">
            <Images imgSrc={logo} alt="website logo"/>
          
          </span>
         
        </CardTitle>
        <CardDescription>{headerText}</CardDescription>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
      {showSocial && (
        <CardFooter>
          <Social />
        </CardFooter>
      )}
      <CardFooter className="flex justify-between">
        <CardBackButton backButtonText={backButtonText} backButtonLinkText={backButtonLinkText} backButtonUrl={backButtonUrl}/>
      </CardFooter>
    </Card>
    )
}