import {FC} from 'react'
import {Button} from "@/components/ui/button";
import {MiniLoader} from "@/components/mini-loader"
type LoadingButtonProps ={
    isPending: boolean,
    message: string,
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
}
export const LoadingButton: FC<LoadingButtonProps> = ({isPending, message, variant="default"}) => {
  return (
    <Button type="submit" variant={variant} disabled={isPending} className="w-full items-center justify-center">
            
            {isPending ? <MiniLoader/>: message}
            
          </Button>
  )
}
