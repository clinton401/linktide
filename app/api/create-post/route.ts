// app/api/create-post/route.ts
import { NextResponse } from "next/server";
import { getServerUser } from "@/hooks/get-server-user";
import { createLinkedinPost } from "@/actions/create-linkedin-post";
import { createTwitterPost } from "@/actions/create-twitter-post";





export async function POST(req: Request) {
  try {
    const data = await req.formData();


    const imagesArray: File[] = data.getAll('imagesArray') as File[];
    const videoFile: File | null = data.get('video') as File | null;
    const postText = data.get('postText') as string ;
    const showTiktok = data.get('showTiktok') === 'true';
    const showLinkedin = data.get('showLinkedin') === 'true';
    const showTwitter = data.get('showTwitter') === 'true';
    const showFacebook = data.get('showFacebook') === 'true';
    const showInstagram = data.get('showInstagram') === 'true';
    const isVideoChosen = data.get('isVideoChosen') === "true";
    // Process images (convert each file to Buffer)
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
  
    // return new Response(JSON.stringify({ success: 'Files processed successfully' }));
   
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

    const session = await getServerUser();

    if (!session) {
      return NextResponse.json(
        { error: "User not allowed to view this resource" },
        { status: 403 }
      );
    }

    const isNoPostData = postText.length < 1 && imagesArray.length < 1 && !videoFile;
    const isNoPlatformChosen =
      !showTiktok &&
      !showLinkedin &&
      !showTwitter &&
      !showFacebook &&
      !showInstagram;

    if (isNoPostData) {
      return NextResponse.json(
        { error: "Please upload at least one text, video, or image to proceed." },
        { status: 400 }
      );
    }

    if (isNoPlatformChosen) {
      return NextResponse.json(
        { error: "Please select at least one social media platform to continue." },
        { status: 400 }
      );

    }

    if (showLinkedin) {
      const {error} = await createLinkedinPost(isVideoChosen, postData )
      if (error) {
        console.error(error);
        if(!platformFailed.includes("linkedin")) {
            platformFailed.push("linkedin")
        }
       
      } else {
        amountSucceded++
      }


    }
    if (showTwitter) {
      const {error} = await createTwitterPost(isVideoChosen, postData )
      if (error) {
        console.error(error);
        if(!platformFailed.includes("twitter")) {
            platformFailed.push("twitter")
        }
       
      } else {
        amountSucceded++
      }


    }
    // if (showTiktok) {
    //   const {error} = await createTiktokPost(isVideoChosen, postData )
    //   if (error) {
    //     console.error(error);
    //     if(!platformFailed.includes("tiktok")) {
    //         platformFailed.push("tiktok")
    //     }
       
    //   } else {
    //     amountSucceded++
    //   }


    // }
    const platformErrorLength = platformFailed.length ;
    const successMessage = `${amountSucceded}/${amountOfPlatforms} sent successfully. ${platformFailed.length > 0 ? `${ platformFailed.map((platform, index) => `${platform}${index + 1 < platformFailed.length ? "," : ""}`).join(" ")} ${platformErrorLength > 1 ? "were": "was"} unsuccessful` : ""}. It might take a while to reflect on the various platforms`;

if(amountSucceded < 1) {
    return NextResponse.json({ error: "Unable to create post" }, { status: 500 });

}
    return NextResponse.json({ success: successMessage });
  } catch (error) {
    console.error(`Posting error: ${error}`);
    return NextResponse.json(
      { error: "Unable to post , try again later." },
      { status: 500 }
    );
  }
}
