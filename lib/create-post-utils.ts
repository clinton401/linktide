import axios from "axios";

type UploadUrlResponse = {
  uploadUrl: string;
  asset: string;
};
const getLinkedinUploadUrl = async (
  accessToken: string,
  userId: string
): Promise<UploadUrlResponse | undefined> => {
  const url = "https://api.linkedin.com/v2/assets?action=registerUpload";
  const requestBody = {
    registerUploadRequest: {
      recipes: ["urn:li:digitalmediaRecipe:feedshare-image"],
      owner: `urn:li:person:${userId}`,
      serviceRelationships: [
        {
          relationshipType: "OWNER",
          identifier: "urn:li:userGeneratedContent",
        },
      ],
    },
  };
  try {
    const response = await axios.post(url, requestBody, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    const data = response.data?.value;
    if (!data) return undefined;
    const uploadUrl = data?.uploadMechanism?.["com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest"]?.uploadUrl;
    const asset = data?.asset;

    if (!uploadUrl || !asset) {
      console.error("Upload URL or asset is missing from the response", { uploadUrl, asset });
      return undefined;
    }

    console.log({ uploadUrl, asset });
    return { uploadUrl, asset };
  } catch (error) {
    console.log(`Unable to get images upload url: ${error}`);
    return undefined;
  }
};

const getMultipleImagesUploadUrl = async (
  accessToken: string,
  userId: string,
  imagesArrayLength: number
) => {
  try {
    const uploadUrlArray: UploadUrlResponse[] = [];
    for (let i = 0; i < imagesArrayLength; i++) {
      const uploadDetails = await getLinkedinUploadUrl(accessToken, userId);
      console.log(`uploadDetails: ${JSON.stringify(uploadDetails)}`)
      if (!uploadDetails) {
        console.log(`Upload details not returned for image ${i + 1}`);
        return undefined;
      }
      uploadUrlArray.push(uploadDetails);
    }
    console.log(uploadUrlArray)
    return uploadUrlArray;
    
  } catch (error) {
    console.log(`Unable to get multiple images upload url: ${error}`);
    return undefined;
  }
};
const uploadLinkedinMedia = async (
  accessToken: string,
  file: File,
  uploadUrl: string
) => {
    console.log(`Uploading media to URL: ${uploadUrl}`);
  try {

    const response = await axios.post(uploadUrl, file, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": file.type,
      },
    });
    if (response.status === 201) {
      return true;
    } else {
      throw new Error(`Failed to upload video`);
    }
  } catch (error) {
    console.error(`Unable to upload each media to linkedin: ${error}`);
    return false;
  }
};
export const uploadAllLinkedinMedia = async (
  accessToken: string,
  userId: string,
  imagesArray: File[],
  video: File| undefined,
  isVideoChosen: boolean
) => {
  try {
    const uploadUrlArray: UploadUrlResponse[] = [];
    if (isVideoChosen) {
      const videoUpload = await getLinkedinUploadUrl(accessToken, userId);
      if (!videoUpload) {
        console.log("Unable to get uploadUrl for the video");
        return undefined;
      }
      if(!video) {
        console.log("No video sent");
        return undefined;
      }
      const videoResponse = await uploadLinkedinMedia(accessToken, video, videoUpload.uploadUrl);
      if (videoResponse === true) {
        uploadUrlArray.length = 0;
        uploadUrlArray.push(videoUpload);
        return uploadUrlArray;
      } else {
        throw new Error(`Failed to upload video `);
      }
    } else {
      const imagesUpload = await getMultipleImagesUploadUrl(
        accessToken,
        userId,
        imagesArray.length
      );
      console.log(imagesUpload)
      if (!imagesUpload) {
        console.log("Unable to get uploadUrl for the images");
        return undefined;
      }
      if(imagesArray.length < 1) {
        console.log("No image sent")
        return undefined
      }
      uploadUrlArray.length = 0;
      for(let i = 0; i < imagesArray.length; i++) {
        const imageResponse = await uploadLinkedinMedia(accessToken, imagesArray[i], imagesUpload[i].uploadUrl);
        console.log(`Image response: ${JSON.stringify(imageResponse)}`)
        if (imageResponse === true) {
            
            uploadUrlArray.push(imagesUpload[i]);
            
          } else {
            throw new Error(`Failed to upload image ${i + 1}`);
          }
      }
      return uploadUrlArray;
    }
  } catch (error) {
    console.error(`Unable to upload all media to linkedin: ${error}`);
    return undefined;
  }
};
export const createLinkedinMediaPost = async (
    accessToken: string,
    userId: string,
    postText: string,
    uploadedAssets: UploadUrlResponse[]
  ) => {
    const url = "https://api.linkedin.com/v2/ugcPosts";
    
    const requestBody = {
      author: `urn:li:person:${userId}`,
      lifecycleState: "PUBLISHED",
      specificContent: {
        "com.linkedin.ugc.ShareContent": {
          shareCommentary: {
            text: postText, 
          },
          shareMediaCategory: uploadedAssets.length === 1 ? "VIDEO" : "IMAGE",
          media: uploadedAssets.map((asset) => ({
            status: "READY",
            description: {
              text: "Uploaded via API", 
            },
            media: asset.asset, 
            title: {
              text: "Media Title", 
            },
          })),
        },
      },
      visibility: {
        "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC", 
      },
    };
  
    try {
      const response = await axios.post(url, requestBody, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          "X-Restli-Protocol-Version": "2.0.0", 
        },
      });
  
      if (response.status === 201) {
     
        return response.data;
      } else {
        throw new Error("Failed to create post");
      }
    } catch (error) {
      console.error(`Error creating LinkedIn post: ${error}`);
      return undefined;
    }
  };

export const createLinkedinTextPost = async (
  accessToken: string,
  userId: string,
  postText: string
) => {
  const url = "https://api.linkedin.com/v2/ugcPosts";

  const requestBody = {
    author: `urn:li:person:${userId}`,
    lifecycleState: "PUBLISHED",
    specificContent: {
      "com.linkedin.ugc.ShareContent": {
        shareCommentary: {
          text: postText, // Your text content
        },
        shareMediaCategory: "NONE", // No media
      },
    },
    visibility: {
      "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC", // Or other visibility options
    },
  };

  try {
    const response = await axios.post(url, requestBody, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "X-Restli-Protocol-Version": "2.0.0", // Required for UGC API
      },
    });

    if (response.status === 201) {
      console.log("Text post created successfully!");
      return response.data;
    } else {
      throw new Error("Failed to create text post");
    }
  } catch (error) {
    console.error(`Error creating LinkedIn post: ${error}`);
    return undefined;
  }
};
