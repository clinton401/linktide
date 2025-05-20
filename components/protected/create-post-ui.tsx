"use client";
import { FC, useState, useEffect, useRef } from "react";
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
import {
  Sparkles,
  ThumbsUp,
  RotateCcw,
} from "lucide-react"
import { useRouter } from "next/navigation";
import type { ISocial } from "@/models/social-media-schema";
import { DiscardAlert } from "@/components/protected/discard-alert";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { Switch } from "@/components/ui/switch";
import { Images } from "@/components/images";
import { MiniLoader } from "@/components/mini-loader";
import axios from "axios";
import type { IOauth } from "@/models/oauth-schema";
// import { useCountdown } from "@/hooks/use-countdown";
// import { getSocialAuthState } from "@/hooks/get-social-auth-state";
import useClientSocialAuth from "@/hooks/use-client-social-auth";
import { generateText } from "@/actions/generate-text";
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
export type UserSession = {
  email?: string | null; 
  id: string;
  image?: string | null;
  oauth?: IOauth[];
  socialMedia?: ISocial[];
  "2FA"?: boolean;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
  isPasswordAvailable?: boolean;
};


export const CreatePostUI: FC<{session: UserSession | undefined}> = ({session}) => {
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
  const [isVideoChosen, setIsVideoChosen] = useState(false);
  const [postText, setPostText] = useState("");
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | undefined>(
    undefined
  );
  const [isEnhanced, setIsEnhanced] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhanceAccepted, setEnhanceAccepted] = useState(false);
  const [originalContent, setOriginalContent] = useState("");
  const [isPostLoading, setIsPostLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoFileInputRef = useRef<HTMLInputElement>(null);
  
  const socialMedia = session?.socialMedia;
  const getIsSocialAuth = (name: string): ISocial | undefined => {
    if (!socialMedia) {
      return undefined;
    }
    return socialMedia.find((social) => social.name === name);
  };
  const isTwitterAuth = useClientSocialAuth(getIsSocialAuth("twitter"))
  const isLinkedinAuth = useClientSocialAuth(getIsSocialAuth("linkedin"))
  // const session = useCurrentUser();
  // const {
  //   isNewClicked,
  //   setIsNewClicked,
  //   countdown: resetCounter,
  // } = useCountdown();
  const { push } = useRouter();
  const { toast } = useToast();
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
  useEffect(() => {
    if (isVideoChosen) {
      setImagePreviewUrls([]);
      setImagesArray([]);
    } else {
      setVideo(undefined);
      setVideoPreviewUrl(undefined);
    }
  }, [isVideoChosen]);
  if (!session) {
    push("/auth/login");
    return;
  }
  const changeImageSection = (changeValue: boolean) => {
    setIsImageSection(changeValue);
  };
  
  const textAreaHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (showTwitter && e.target.value.length > 280) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Your post must be 280 characters or less.",
      });
    } else {

      setPostText(e.target.value);
      if(enhanceAccepted){
        setEnhanceAccepted(false);
      }
    }
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const selectedFiles = Array.from(e.target.files);
    for (const selectedFile of selectedFiles) {
      if (!selectedFile.type.startsWith("image/")) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Please select only image files.",
        });
        return;
      }
    }
    if (selectedFiles.length + imagesArray.length > 4) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "You can only upload up to 4 images.",
      });
      return;
    }

    setImagesArray((prev) => [...prev, ...selectedFiles]);
    const newPreviews = selectedFiles.map((file) => URL.createObjectURL(file));
    setImagePreviewUrls((prev) => [...prev, ...newPreviews]);
  };
  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
  
    const selectedVideo = e.target.files[0];
  
    if (!selectedVideo.type.startsWith("video/")) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Please select a video file.",
      });
      return;
    }
  
    const maxSizeInBytes = 500 * 1024 * 1024; 
    if (selectedVideo.size > maxSizeInBytes) {
      toast({
        variant: "destructive",
        title: "File too large.",
        description: "The video must be less than 500 MB.",
      });
      return;
    }
  
    setVideo(selectedVideo);
    const previewUrl = URL.createObjectURL(selectedVideo);
    
    const videoElement = document.createElement("video");
    videoElement.src = previewUrl;
  
    videoElement.onloadedmetadata = () => {
      const duration = videoElement.duration; 
      const twitterMax = 140;
      const normalMax = 600; 
  
      const isTwitterLimitPassed = showTwitter && duration > twitterMax;
      const isNormalLimitPassed = duration > normalMax;
  
      if (isTwitterLimitPassed) {
        toast({
          variant: "destructive",
          title: "Video too long.",
          description: "Twitter videos must be less than 2 minutes and 20 seconds (140 seconds).",
        });
        resetVideoState(); 
        return;
      } else if (isNormalLimitPassed) {
        toast({
          variant: "destructive",
          title: "Video too long.",
          description: "The video must be less than 10 minutes.",
        });
        resetVideoState();
        return;
      }
  
      
    };
  
    setVideoPreviewUrl(previewUrl);
    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  };
  
  const resetVideoState = () => {
    setVideo(undefined);
    setVideoPreviewUrl(undefined);
  }
  const fileUploadButton = () => {
    fileInputRef.current?.click();
  };
  const videoFileUploadButton = () => {
    videoFileInputRef.current?.click();
  };
  const switchHandler = () => {
    setIsVideoChosen(!isVideoChosen);
  };
  const discardHandler = () => {
    setVideo(undefined);
    setShowTiktok(undefined);
    setShowLinkedin(undefined);
    setShowTwitter(undefined);
    setShowFacebook(undefined);
    setShowInstagram(undefined);
    setImagePreviewUrls([]);
    setVideoPreviewUrl(undefined);
    setImagesArray([]);

    setPostText("");
  };
 
  const createPostHandler = async () => {
    if (!isReadyToPost) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please upload at least one text, video, or image to proceed.",
      });
      return;
    }
    if (showTwitter && postText.length > 280) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Your post must be 280 characters or less.",
      });
      return;
    }

   
   

  
    try {
  
let errorMessage: null | string = null;

if (showTwitter && !isTwitterAuth && showLinkedin && !isLinkedinAuth) {
  errorMessage = "To post to Twitter and LinkedIn, you need to connect both accounts.";
} else if (showTwitter && !isTwitterAuth) {
  errorMessage = "To post to Twitter, connect your Twitter account.";
} else if (showLinkedin && !isLinkedinAuth) {
  errorMessage = "To post to LinkedIn, connect your LinkedIn account.";
}
if(errorMessage) {
  return toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
}

       toast({
      description: " Note: This may take a while. Thank you for your patience!",
    });

    const formData = new FormData();
    formData.append('postText', postText);


    imagesArray.forEach((image) => {
      formData.append(`imagesArray`, image); 
    });

    if (video) {
      formData.append('video', video);
    }

    // Append other data
    formData.append('showTiktok', String(showTiktok));
    formData.append('showLinkedin', String(showLinkedin));
    formData.append('showTwitter', String(showTwitter));
    formData.append('showFacebook', String(showFacebook));
    formData.append('showInstagram', String(showInstagram));
    formData.append('isVideoChosen', String(isVideoChosen));
      setIsPostLoading(true);
      // setIsNewClicked(false);
      const response = await axios.post('/api/create-post', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', 
        },
      })
  
      if (response.data.success) {
        toast({
          description: response.data.success || "Post sent successfully!",
        });
        // setIsNewClicked(true)
        discardHandler()
      } else {
        // setIsNewClicked(false);
        toast({
          variant: "destructive",
          title: "Error",
          description: response.data.error || "Unable to post, please try again.",
        });
      }
    } catch (error) {
      console.error("Error posting:", error);
      if(axios.isAxiosError(error) && error.response){
        toast({
          variant: "destructive",
          title: "Error",
          description: error.response.data?.error || "Unable to post, please try again.",
        });
      }else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Unable to post, please try again.",
        });
      }
      // setIsNewClicked(false)
      
    } finally {
      setIsPostLoading(false);
    }
  };

  const handleEnhanceContent = async () => {
    if (!postText.trim() || postText.trim().length < 100) {
      toast({
        title: "Post too short",
        description: "Please enter at least 100 characters before enhancing your content.",
        variant: "destructive",
      });
      return;
    }
    

    setOriginalContent(postText)
   

   

    try{
      setIsEnhancing(true);

      const response = await generateText(postText, showTwitter);
      const {error, prompt} = response;

      if(error || !prompt){
        return  toast({
          variant: "destructive",
          title: "Error",
          description: error || "Failed to generate text",
        });
      }

      setPostText(prompt)

      setIsEnhanced(true);

      toast({
        title: "Content enhanced!",
        description: "Your post has been enhanced with AI.",
      })
    }catch(error){
      console.error(`Error generating text: ${error}`);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate content.",
      });
    }finally {
      setIsEnhancing(false)
    }
  }


  const handleAccept = () => {
    setIsEnhanced(false);
    setOriginalContent("");
    setEnhanceAccepted(true)
    toast({
      title: "Enhanced version accepted",
      description: "You're now using the AI-enhanced version.",
    }) 
  }

  const handleReject = () => {
    setPostText(originalContent)
    setIsEnhanced(false);
    setOriginalContent("");
    toast({
      title: "Enhanced version rejected",
      description: "Reverted to your original version.",
    })
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
              onClick={() => changeImageSection(false)}
              className={`w-1/2 p-2  rounded ${
                !isImageSection ? "bg-background " : ""
              }   transition-colors duration-300 ease-in`}
            >
              <CiFileOn className="mr-2" />
              Post
            </button>
            <button
              onClick={() => changeImageSection(true)}
              className={`w-1/2 p-2  rounded ${
                isImageSection ? "bg-background " : ""
              }   transition-colors duration-300 ease-in`}
            >
              <CiImageOn className="mr-2" /> Image Or Video
            </button>
          </div>
          {isImageSection && (
            <motion.div
              variants={sectionAnimation}
              initial="hidden"
              animate={"visible"}
              exit="exit"
              key="section-animation"
              className="w-full  flex-col gap-4 items-center justify-center  flex"
            >
              <div className="w-full flex items-center  gap-2 justify-center text-xs">
                <span>Image</span>{" "}
                <Switch
                  checked={isVideoChosen}
                  onCheckedChange={switchHandler}
                />
                <span>Video</span>
              </div>
              {isVideoChosen ? (
                <>
                  <div className="w-full rounded-md border border-dashed min-h-[164px] flex flex-col items-center justify-center gap-2">
                    <Button variant="outline" onClick={videoFileUploadButton}>
                      <input
                        type="file"
                        accept="video/mp4"
                        className="hidden"
                        ref={videoFileInputRef}
                        onChange={handleVideoFileChange}
                      />
                      Upload a video
                    </Button>
                    <p className="w-full text-center text-xs text-secondary">
                      You an upload only one video
                    </p>
                  </div>
                  {videoPreviewUrl && (
                    <div style={{ marginTop: "10px" }}>
                      <video
                        src={videoPreviewUrl}
                        controls
                        className="w-full aspect-video object-cover"
                      />
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="w-full rounded-md border border-dashed min-h-[164px] flex flex-col items-center justify-center gap-2">
                    <Button variant="outline" onClick={fileUploadButton}>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                      />
                      Upload images
                    </Button>
                    <p className="w-full text-center text-xs text-secondary">
                      You an upload up to 4 images
                    </p>
                  </div>
                  {imagePreviewUrls.length > 0 && (
                    <div className="flex w-full justify-center gap-4 items-center flex-wrap ">
                      {imagePreviewUrls.map((image: string, index: number) => {
                        return (
                          <span
                            key={index}
                            className="w-[150px] rounded-md relative overflow-hidden aspect-square"
                          >
                            <Images
                              imgSrc={image}
                              alt={`Preview ${index + 1}`}
                            />
                          </span>
                        );
                      })}
                    </div>
                  )}
                </>
              )}
            </motion.div>
          )}
          {!isImageSection && (
            <motion.div
              variants={sectionAnimation}
              initial="hidden"
              animate={"visible"}
              exit="exit"
              key="section-animation-two"
              className="  w-full  flex-col gap-8 flex"
            >
              <Textarea
                onChange={textAreaHandler}
                value={postText}
                disabled={isPostLoading || isEnhancing}
                spellCheck="false"
                placeholder="Type your message here."
                className="max-h-[4500px] min-h-[200px] "
              />

              {!enhanceAccepted && (
                <div className="w-full flex items-center gap-2 justify-end">
                  {/* div className="flex items-center gap-2"> */}
                  {isEnhanced ? (
                    <>
                      <Button
                        disabled={isEnhancing || isPostLoading}
                        variant="outline"
                        size="sm"
                        onClick={handleReject}
                        className="h-8 border-red-200 hover:border-red-300 dark:border-red-900 dark:hover:border-red-800"
                      >
                        <RotateCcw className="h-3.5 w-3.5 mr-1 text-red-500" />
                        Revert
                      </Button>
                      <Button
                        disabled={isEnhancing || isPostLoading}
                        size="sm"
                        onClick={handleAccept}
                        className="h-8 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
                      >
                        <ThumbsUp className="h-3.5 w-3.5 mr-1" />
                        Keep
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={handleEnhanceContent}
                      disabled={isPostLoading || isEnhancing || !postText.trim()}
                      className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      {isEnhancing ? "Enhancing..." : "Enhance with AI"}
                    </Button>
                  )}
                </div>
              )}
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
                  <span>Choose platforms</span>
                  <IoIosArrowDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full min-w-[250px]">
                <DropdownMenuLabel>Platforms</DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuCheckboxItem
                  checked={showLinkedin}
                  onCheckedChange={setShowLinkedin}
                  disabled={isLinkedinAuth ? false : true}
                >
                  Linkedin
                </DropdownMenuCheckboxItem>

                <DropdownMenuCheckboxItem
                  checked={showTwitter}
                  onCheckedChange={setShowTwitter}
                  disabled={isTwitterAuth ? false : true}
                >
                  Twitter
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={showTiktok}
                  onCheckedChange={setShowTiktok}
                  disabled={true}
                >
                  Tiktok
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={showFacebook}
                  onCheckedChange={setShowFacebook}
                  disabled={true}
                >
                  Facebook
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={showInstagram}
                  onCheckedChange={setShowInstagram}
                  disabled={true}
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
          <p className="text-sm md:text-left w-full text-center">
            Posting to TikTok, Facebook, and Instagram is currently unavailable
          </p>
          {(!isLinkedinAuth || !isTwitterAuth) && (
            <p className="text-sm md:text-left text-center">
              To post on more social media platforms, click{" "}
              <span>
                <Link
                  href="/analytics/linkedin"
                  className="text-primary underline"
                >
                  here
                </Link>
              </span>{" "}
              to authenticate your accounts.
            </p>
          )}
        </section>
      </div>
      <div
        className="w-full flex  md:border-t *:px-[3%]
 justify-end flex-wrap items-center md:pb-0 pb-[80px] "
      >
        {/* <section className="w-full md:w-[65%] md:justify-start justify-center py-4 md:border-r flex ">
          <DiscardAlert
            isReadyToDiscard={isReadyToDiscard || isPostLoading}
            discardHandler={discardHandler}
          />
        </section> */}
        <section className="w-full md:w-[35%] md:py-4 gap-y-4 gap-x-2  md:border-l flex items-center justify-center md:justify-between ">
          <DiscardAlert
            isReadyToDiscard={isReadyToDiscard || isPostLoading || isEnhancing }
            discardHandler={discardHandler}
          />
          {/* <RegenerateButton
            isNewEmailPending={isPostLoading}
            isResendClicked={isResendClicked}
            resendCode={createPostHandler}
            resetCounter={resetCounter}
            isCreatePage={true}
            createName="Post"
            createIsReady={!isReadyToPost}
          /> */}
          <Button
            className="w-[90px]"
            disabled={
              !isReadyToPost || isPostLoading  || isEnhancing
            }
            onClick={() => createPostHandler()}
          >
            {isPostLoading && <MiniLoader />}
          

            {!isPostLoading  && "Post"}
          </Button>
        </section>
      </div>
    </>
  );
};
