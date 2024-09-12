"use client"
import {FC} from "react"
import Link from "next/link"
type CardBackButton ={
    backButtonText?: string,
    backButtonUrl: string,
    backButtonLinkText: string
}

export const CardBackButton: FC<CardBackButton> = ({
    backButtonText,
    backButtonLinkText,
    backButtonUrl
}) => {
    return (
        <span className="flex items-center w-full text-sm justify-center">
{backButtonText && backButtonText} <Link href={backButtonUrl} className="ml-1 text-primary">{backButtonLinkText}</Link>
        </span>
    )
}