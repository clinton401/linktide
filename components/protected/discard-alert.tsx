import {FC} from "react"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
  import { Button } from "@/components/ui/button"
  type DiscardProps = {
    isReadyToDiscard: boolean; discardHandler: ()=> void
  }
  export const DiscardAlert:FC<DiscardProps> = ({isReadyToDiscard, discardHandler}) =>{
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button 
            variant="outline"
            className="w-[90px]"
            disabled={!isReadyToDiscard} >Discard</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
            Action cannot be undone. This will delete your post, including text, images and videos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={discardHandler}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  }
  