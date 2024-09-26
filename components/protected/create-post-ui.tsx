"use client";
import { FC, useState, useEffect } from "react";
import { CiFileOn, CiImageOn } from "react-icons/ci";
import { motion } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { IoIosArrowDown } from "react-icons/io";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useRouter } from "next/navigation";
import type { ISocial } from "@/models/social-media-schema";
  import {DiscardAlert} from "@/components/protected/discard-alert"
  import { Badge } from "@/components/ui/badge"
  import { useToast } from "@/hooks/use-toast";
  import Link from "next/link"
type Checked = DropdownMenuCheckboxItemProps["checked"];
const sectionAnimation = {
  hidden: {
    y: 50,
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeInOut",
      mass: 0.4,
      damping: 8,
    },
  },
  exit: {
    y: 50,
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
};

export const CreatePostUI: FC = () => {
  const [isImageSection, setIsImageSection] = useState(false);
  const [showTiktok, setShowTiktok] = useState<Checked>(false);
  const [showLinkedin, setShowLinkedin] = useState<Checked>(false);
  const [showTwitter, setShowTwitter] = useState<Checked>(false);
  const [showFacebook, setShowFacebook] = useState<Checked>(false);
  const [showInstagram, setShowInstagram] = useState<Checked>(false);
  const [imagesArray, setImagesArray] = useState<File[]>([]);
  const [video, setVideo] = useState<undefined | File>(undefined);
  const [isReadyToPost, setIsReadyToPost] = useState(false);
  const [isReadyToDiscard, setIsReadyToDiscard] = useState(false);
  const [postText, setPostText] = useState("");
  const session = useCurrentUser();
  const { push } = useRouter();
  const { toast } = useToast()
  useEffect(() => {
    if (!video && imagesArray.length < 1 && postText.length < 1) {
      setIsReadyToDiscard(false);
    } else {
      setIsReadyToDiscard(true);
    }
  }, [video, imagesArray, postText]);

  useEffect(() => {
    const isPlatformNotChosen =
      !showTiktok &&
      !showLinkedin &&
      !showTwitter &&
      !showFacebook &&
      !showInstagram;

    if (!video && imagesArray.length < 1 && postText.length < 1) {
      setIsReadyToPost(false);
    } else if (isPlatformNotChosen) {
      setIsReadyToPost(false);
    } else {
      setIsReadyToPost(true);
    }
  }, [
    video,
    imagesArray,
    showTiktok,
    showLinkedin,
    showTwitter,
    showFacebook,
    showInstagram,
    postText,
  ]);

  if (!session) {
    push("/auth/login");
    return;
  }
  const socialMedia = session.socialMedia;
  const changeImageSection = () => {
    setIsImageSection(!isImageSection);
  };
  const getIsSocialAuth = (name: string): ISocial | undefined => {
    if (!socialMedia) {
      return undefined;
    }
    return socialMedia.find((social) => social.name === name);
  };
  const textAreaHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if(showTwitter && e.target.value.length > 120) {
        toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "Your post must be 280 characters or less.",
           
          })

    } else {
    setPostText(e.target.value);}
  };
  const discardHandler=()=> {
    setVideo(undefined);
    setImagesArray([]);
    setPostText("")
  }

  return (
    <>
      <div className="md:w-[65%] w-full gap-y-4 flex flex-col *:px-[5%]  post_section border-r  ">
        <section className="w-full flex flex-col  py-4 border-b border-secondary">
          <h3 className={` font-bold text-xs text-primary`}>Step 1</h3>
          <h2 className={`  font-black text-xl`}>Create a post</h2>
        </section>
        <section className="flex flex-col flex-grow  items-center gap-4 overflow-hidden  py-4">
          <div className="p-1 w-full bg-secondary text-sm rounded-md max-w-[400px] flex *:cursor-pointer *:flex *:justify-center *:items-center justify-center">
            <button
              onClick={changeImageSection}
              className={`w-1/2 p-2  rounded ${
                !isImageSection ? "bg-background " : ""
              }   transition-colors duration-300 ease-in`}
            >
              <CiFileOn className="mr-2" />
              Post
            </button>
            <button
              onClick={changeImageSection}
              className={`w-1/2 p-2  rounded ${
                isImageSection ? "bg-background " : ""
              }   transition-colors duration-300 ease-in`}
            >
              <CiImageOn className="mr-2" /> Image & Video
            </button>
          </div>
          {isImageSection && (
            <motion.div
              variants={sectionAnimation}
              initial="hidden"
              animate={"visible"}
              exit="exit"
              key="section-animation"
              className="w-full    flex"
            >
              <span className="w-full rounded-md border border-dashed min-h-[200px] flex flex-col items-center justify-center gap-4">
                <Button variant="outline">Upload a file</Button>
              </span>
            </motion.div>
          )}
          {!isImageSection && (
            <motion.div
              variants={sectionAnimation}
              initial="hidden"
              animate={"visible"}
              exit="exit"
              key="section-animation-two"
              className="  w-full flex"
            >
              <Textarea
                onChange={textAreaHandler}
                value={postText}
                spellCheck="false"
                placeholder="Type your message here."
                className="max-h-[4500px] min-h-[200px]"
              />
            </motion.div>
          )}
        </section>
      </div>
      <div className="md:w-[35%] w-full gap-y-4 flex flex-col *:px-[5%]  post_section  flex-grow ">
        <section className="w-full flex flex-col  py-4 border-b border-secondary">
          <h3 className={` font-bold text-xs text-primary`}>Step 2</h3>
          <h2 className={`  font-black text-xl`}>Choose where to share</h2>
        </section>
        <section className="flex flex-col flex-grow  items-center gap-4 overflow-hidden  py-4">
          <div className="w-full flex items-center md:justify-start justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full max-w-[250px] min-h-[44px] flex justify-between gap-1 text-sm items-center"
                >
                  <span>Choose platform</span>
                  <IoIosArrowDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full min-w-[250px]">
                <DropdownMenuLabel>Platforms</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                  checked={showTiktok}
                  onCheckedChange={setShowTiktok}
                  disabled={getIsSocialAuth("tiktok") ? false : true}
                >
                  Tiktok
                </DropdownMenuCheckboxItem>

                <DropdownMenuCheckboxItem
                  checked={showLinkedin}
                  onCheckedChange={setShowLinkedin}
                  disabled={getIsSocialAuth("linkedin") ? false : true}
                >
                  Linkedin
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={showTwitter}
                  onCheckedChange={setShowTwitter}
                  disabled={getIsSocialAuth("twitter") ? false : true}
                >
                  Twitter
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={showFacebook}
                  onCheckedChange={setShowFacebook}
                  disabled={getIsSocialAuth("facebook") ? false : true}
                >
                  Facebook
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={showInstagram}
                  onCheckedChange={setShowInstagram}
                  disabled={getIsSocialAuth("instagram") ? false : true}
                >
                  Instagram
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="w-full flex flex-wrap md:justify-start justify-center items-center gap-4">
         {showTiktok && <Badge variant="outline">Tiktok</Badge>}
         {showLinkedin && <Badge variant="outline">Linkedin</Badge>}
         {showTwitter && <Badge variant="outline">Twitter</Badge>}
         {showFacebook && <Badge variant="outline">Facebook</Badge>}
         {showInstagram && <Badge variant="outline">Instagram</Badge>}
          </div>
          {(!getIsSocialAuth("tiktok") || !getIsSocialAuth("linkedin") || !getIsSocialAuth("twitter")) && <p className="text-sm md:text-left text-center">To post on more social media platforms, click <span><Link href="/analytics/tiktok" className="text-primary underline">here</Link></span> to authenticate your accounts.</p>}
          
        </section>
      </div>
      <div
        className="w-full flex  md:border-t *:px-[3%]
 justify-between flex-wrap items-center md:pb-0 pb-[80px] "
      >
        <section className="w-full md:w-[65%] md:justify-start justify-center py-4 md:border-r flex ">
            <DiscardAlert isReadyToDiscard={isReadyToDiscard} discardHandler={discardHandler}/>
          
        </section>
        <section className="w-full md:w-[35%] md:py-4 gap-y-4 gap-x-2   flex items-center justify-center md:justify-between ">
          <Button
            variant="secondary"
            className="w-[90px]"
            disabled={!isReadyToPost}
          >
            Save draft
          </Button>
          <Button className="w-[90px]" disabled={!isReadyToPost}>
            Post
          </Button>
        </section>
      </div>
    </>
  );
};
