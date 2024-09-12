import {FC, ReactNode} from "react"
 
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
        <CardTitle className="font-black text-3xl">Linktide</CardTitle>
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