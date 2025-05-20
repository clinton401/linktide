// app/actions/social-media.ts
'use server'

import { getServerUser } from "@/hooks/get-server-user";
import { createLinkedinPost } from "@/actions/create-linkedin-post";
import { createTwitterPost } from "@/actions/create-twitter-post";
import { rateLimit } from "@/lib/rate-limit";

export async function createPost(formData: FormData) {
    try {
        const session = await getServerUser();

        if (!session) {
            return { error: "User not allowed to view this resource", status: 403, message: null };
        }

        const { error: rateLimitError } = rateLimit(session.id, true);
        if (rateLimitError) {
            return { error: rateLimitError, status: 403, message: null };
        }

        const imagesArray: File[] = Array.from(formData.getAll('imagesArray')) as File[];
        const videoFile: File | null = formData.get('video') as File | null;
        const postText = formData.get('postText') as string;
        const showTiktok = formData.get('showTiktok') === 'true';
        const showLinkedin = formData.get('showLinkedin') === 'true';
        const showTwitter = formData.get('showTwitter') === 'true';
        const showFacebook = formData.get('showFacebook') === 'true';
        const showInstagram = formData.get('showInstagram') === 'true';
        const isVideoChosen = formData.get('isVideoChosen') === "true";

        const imageBuffers = await Promise.all(
            imagesArray.map(async (image) => {
                const arrayBuffer = await image.arrayBuffer();
                return Buffer.from(arrayBuffer);
            })
        );

        let videoBuffer: Buffer | null = null;
        if (videoFile) {
            const arrayBuffer = await videoFile.arrayBuffer();
            videoBuffer = Buffer.from(arrayBuffer);
        }

        const postData = {
            postText,
            imagesArray: imageBuffers,
            video: videoBuffer,
            showTiktok,
            showLinkedin,
            showTwitter,
            showFacebook,
            showInstagram,
          }
            
             
          let amountOfPlatforms = 0;
          let amountSucceded = 0;
          const platformFailed: string[] = []
          if(showTiktok) {
              amountOfPlatforms++
          }
          if(showLinkedin) {
              amountOfPlatforms++
          }
          if(showTwitter) {
              amountOfPlatforms++
          }
          if(showFacebook) {
              amountOfPlatforms++
          }
          if(showInstagram) {
              amountOfPlatforms++
          }
          
              
          
              const isNoPostData = postText.length < 1 && imagesArray.length < 1 && !videoFile;
              const isNoPlatformChosen =
                !showTiktok &&
                !showLinkedin &&
                !showTwitter &&
                !showFacebook &&
                !showInstagram;
          
              if (isNoPostData) {
                return { error: "Please upload at least one text, video, or image to proceed." ,status: 400, message: null }
                
              }
          
              if (isNoPlatformChosen) {
                  return { error: "Please select at least one social media platform to continue.", status: 400, message: null }
          
              }
          
              const tasks = [];
          
              if (showLinkedin) {
                tasks.push(
                  createLinkedinPost(isVideoChosen, postData).then(({ error }) => {
                    if (error) {
                      console.error(error);
                      if (!platformFailed.includes("linkedin")) {
                        platformFailed.push("linkedin");
                      }
                    } else {
                      amountSucceded++;
                    }
                  })
                );
              }
              
              if (showTwitter) {
                tasks.push(
                  createTwitterPost(isVideoChosen, postData).then(({ error }) => {
                    if (error) {
                      console.error(error);
                      if (!platformFailed.includes("twitter")) {
                        platformFailed.push("twitter");
                      }
                    } else {
                      amountSucceded++;
                    }
                  })
                );
              }
              
              await Promise.allSettled(tasks);
              
           
              const platformErrorLength = platformFailed.length ;
              const successMessage = `${amountSucceded}/${amountOfPlatforms} sent successfully. ${platformFailed.length > 0 ? `${ platformFailed.map((platform, index) => `${platform}${index + 1 < platformFailed.length ? "," : ""}`).join(" ")} ${platformErrorLength > 1 ? "were": "was"} unsuccessful` : ""}. It might take a while to reflect on the various platforms`;
          
          if(amountSucceded < 1) {
              return { error: "Unable to create post", status: 500, message: null };
          
          }

        return { message: successMessage, error: null, status: null };
    } catch (error) {
        console.error(`Posting error: ${error}`);
        return { error: "Unable to post, try again later.", status: 500, message: null };
    }
}