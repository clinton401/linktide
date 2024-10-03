import axios from "axios";
import { TwitterApi } from "twitter-api-v2";
import { getSocialMediaDetails } from "@/hooks/get-social-media-details";


const generateRandomNumber = (): string => {
  // Generates a random number between 100 and 999 (inclusive)
  return Math.floor(100 + Math.random() * 900).toString();
};


// tiktok

const bufferToBlob = (buffer: Buffer): Blob => {
  return new Blob([buffer]);
};


export const uploadMediaToTikTok = async (accessToken: string, mediaBuffer: Buffer) => {
  const formData = new FormData();
  const mediaBlob = bufferToBlob(mediaBuffer);
  const staticFilename = 'media_file';

  formData.append('media', mediaBlob,  staticFilename );
 

  try {
    const response = await axios.post('https://open-api.tiktok.com/media/upload/', formData, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.media_id;
  } catch (error) {
    console.error('Error uploading media:', error);
    throw error;
  }
};

export const uploadTiktokVideoBuffer = async (uploadUrl: string, videoBuffer: Buffer) => {
  try {
    const videoSize = videoBuffer.length;
    const headers = {
      'Content-Range': `bytes 0-${videoSize - 1}/${videoSize}`,
      'Content-Type': 'video/mp4',
    };

    
    const response = await axios.put(uploadUrl, videoBuffer, {
      headers,
    });

    console.log('Video upload successful:', response.data);
    return response.data;
  } catch (error: unknown) {
    // Check if the error is an Axios error
    if (axios.isAxiosError(error)) {
      const apiError = error.response?.data?.error;
      if (apiError && apiError.message) {
        console.error(`TikTok video upload error: ${apiError.message}`);
        throw new Error(apiError.message);
      }
      // Log the status code and response if available
      console.error(`Error ${error.response?.status}:`, error.response?.data);
    } else {
      // Handle unexpected errors
      console.error('Unexpected error:', error);
    }
  
    throw new Error(error instanceof Error ? error.message : 'Unknown error occurred during video upload ');
  }}
export const initiateTiktokVideoUpload = async (accessToken: string, videoSize: number, description: string) => {
  let chunkSize: number;
  let totalChunkCount: number;

  if (videoSize < 5 * 1024 * 1024) { // Less than 5 MB
    // Upload as a whole
    chunkSize = videoSize;
    totalChunkCount = 1;
  } else if (videoSize <= 64 * 1024 * 1024) { // Between 5 MB and 64 MB
    chunkSize = 10 * 1024 * 1024; // Set chunk size to 10 MB
    totalChunkCount = Math.floor(videoSize / chunkSize);
    // If there's any remainder, add one more chunk
    if (videoSize % chunkSize > 0) {
      totalChunkCount += 1;
    }
  } else { // Greater than 64 MB
    chunkSize = 10 * 1024 * 1024; 
    totalChunkCount = Math.floor(videoSize / chunkSize);
    if (videoSize % chunkSize > 0) {
      totalChunkCount += 1;
    }
  }

  // Ensure total chunk count does not exceed 1000
  if (totalChunkCount > 1000) {
    throw new Error("Total chunk count exceeds the maximum limit of 1000.");
  }

 
  
  const postData = {
    post_info: {
      title: description,
      privacy_level: "PUBLIC_TO_EVERYONE",
      disable_duet: false,
      disable_comment: false,
      disable_stitch: false,
      video_cover_timestamp_ms: 1000
    },
    source_info: {
      source: "FILE_UPLOAD",
      video_size: videoSize,
      chunk_size: chunkSize,
      total_chunk_count: totalChunkCount
    }
  };

  try {
    const response = await axios.post('https://open.tiktokapis.com/v2/post/publish/inbox/video/init/', postData, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json; charset=UTF-8',
      },
    });

    const { data, error } = response.data;
    if (error && error.message) {
      throw new Error(error.message); 
    }

    return { upload_url: data.upload_url, publish_id: data.publish_id }; 
  } catch (error: unknown) {
    // Check if the error is an Axios error
    if (axios.isAxiosError(error)) {
      const apiError = error.response?.data?.error;
      if (apiError && apiError.message) {
        console.error(`TikTok API error: ${apiError.message}`);
        throw new Error(apiError.message);
      }
      console.error(`Error ${error.response?.status}:`, error.response?.data);
    } else {
      console.error('Unexpected error:', error);
    }
  
    throw new Error(error instanceof Error ? error.message : 'Unknown error occurred during video upload initialization');
  }
}










// twitter

const getClient = async () => {
  const {
    TWITTER_API_KEY: CONSUMER_KEY,
    TWITTER_API_SECRET_KEY: CONSUMER_SECRET
  } = process.env;

  if (!CONSUMER_KEY || !CONSUMER_SECRET ) {
    console.log("NO keys");
    return undefined;
  }

  const twitterMediaDetails = await getSocialMediaDetails("twitter");
  if (
    !twitterMediaDetails ||
    !twitterMediaDetails.accessToken ||
    !twitterMediaDetails.refreshToken
  ) {
    console.log("No social media details");
    return undefined;
  }
  const client = new TwitterApi({
    appKey: CONSUMER_KEY,
    appSecret: CONSUMER_SECRET,
    accessToken: twitterMediaDetails.accessToken,
    accessSecret: twitterMediaDetails.refreshToken,
  });
  return client;
};

export const uploadTwitterMultipleMedia = async (files: Buffer[]) => {
  const mediaIds: string[] = [];
  const client = await getClient();
  for (const file of files) {
    try {
      // const fileType = await fileTypeFromFile(file);

      // if (!fileType) {
      //   throw new Error('Could not determine file type');
      // }
      // const fileFile = await fileToFile(file);
      if (!client) {
        throw new Error("Unable to create twitter client");
      }
      const mediaId = await client.v1.uploadMedia(file, {
        mimeType: "image/png", // Specify the MIME type here
      });


      mediaIds.push(mediaId);
    } catch (error) {
      console.error("Error uploading media:", error);
      throw error;
    }
  }
  return mediaIds;
};

export const uploadTwitterVideo = async (videoFile: Buffer) => {
  try {
    // const videoFile = await fileToFile(videoFile);
    // const fileType = await fileTypeFromFile(videoFile);

    // if (!fileType) {
    //   throw new Error('Could not determine file type');
    // }
    const client = await getClient();
    if (!client) {
      throw new Error("Unable to create twitter client");
    }
    const mediaId = await client.v1.uploadMedia(videoFile, { mimeType: "video/mp4" });
    return mediaId;
  } catch (error) {
    console.error("Error uploading video:", error);
    throw error;
  }
};

// linkedin

type UploadUrlResponse = {
  uploadUrl: string;
  asset: string;
};
const getLinkedinUploadUrl = async (
  accessToken: string,
  userId: string,
  video: boolean
): Promise<UploadUrlResponse | undefined> => {
  const url = "https://api.linkedin.com/v2/assets?action=registerUpload";
  const requestBody = {
    registerUploadRequest: {
      recipes: [
        `urn:li:digitalmediaRecipe:feedshare-${video ? "video" : "image"}`,
      ],
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
    const uploadUrl =
      data?.uploadMechanism?.[
        "com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest"
      ]?.uploadUrl;
    const asset = data?.asset;

    if (!uploadUrl || !asset) {
      console.error("Upload URL or asset is missing from the response", {
        uploadUrl,
        asset,
      });
      return undefined;
    }

    // console.log({ uploadUrl, asset });
    return { uploadUrl, asset };
  } catch (error) {
    console.error(`Unable to get images upload url: ${error}`);
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
      const uploadDetails = await getLinkedinUploadUrl(
        accessToken,
        userId,
        false
      );
      //   console.log(`uploadDetails: ${JSON.stringify(uploadDetails)}`)
      if (!uploadDetails) {
        // console.log(`Upload details not returned for image ${i + 1}`);
        return undefined;
      }
      uploadUrlArray.push(uploadDetails);
    }
    // console.log(uploadUrlArray)
    return uploadUrlArray;
  } catch (error) {
    console.error(`Unable to get multiple images upload url: ${error}`);
    return undefined;
  }
};


const generateUniqueFilename = (
  baseName: string,
  extension: string
): string => {
  const randomNumbers = `${generateRandomNumber()}-${generateRandomNumber()}-${generateRandomNumber()}`;
  return `${baseName}-${randomNumbers}.${extension}`;
};
const uploadLinkedinMedia = async (
  accessToken: string,
  file: Buffer,
  uploadUrl: string,
  baseName: string = "upload",
  extension: string = "media"
): Promise<boolean> => {
  //   console.log(`Uploading media to URL: ${uploadUrl}`);
  const uniqueFileName = generateUniqueFilename(baseName, extension);
  try {
    const response = await axios.post(uploadUrl, file, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/octet-stream", // Set this to the appropriate type if known
        "Content-Disposition": `attachment; filename="${uniqueFileName}"`, // Use unique filename here
      },
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
    });


    if (response.status === 200 || response.status === 201) {
      console.log("Upload successful");
      return true;
    } else {
      throw new Error(
        `Failed to upload media, status code: ${response.status}`
      );
    }
  } catch (error) {
    console.error(
      `Unable to upload media to LinkedIn: ${(error as Error).message || error}`
    );
    return false;
  }
};

export const uploadAllLinkedinMedia = async (
  accessToken: string,
  userId: string,
  imagesArray: Buffer[],
  video: Buffer | undefined | null,
  isVideoChosen: boolean
) => {
  try {
    const uploadUrlArray: UploadUrlResponse[] = [];
    if (isVideoChosen) {
      const videoUpload = await getLinkedinUploadUrl(accessToken, userId, true);
      if (!videoUpload) {
        console.log("Unable to get uploadUrl for the video");
        return undefined;
      }
      if (!video) {
        console.log("No video sent");
        return undefined;
      }
      const videoResponse = await uploadLinkedinMedia(
        accessToken,
        video,
        videoUpload.uploadUrl
      );
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
      //   console.log(imagesUpload)
      if (!imagesUpload) {
        console.log("Unable to get uploadUrl for the images");
        return undefined;
      }
      if (imagesArray.length < 1) {
        console.log("No image sent");
        return undefined;
      }
      uploadUrlArray.length = 0;
      for (let i = 0; i < imagesArray.length; i++) {
        const imageResponse = await uploadLinkedinMedia(
          accessToken,
          imagesArray[i],
          imagesUpload[i].uploadUrl
        );
        // console.log(`Image response: ${JSON.stringify(imageResponse)}`)
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
  uploadedAssets: UploadUrlResponse[],
  isVideoChosen: boolean
) => {
  // console.log(`uploaded Assets: ${JSON.stringify(uploadedAssets)}`)
  const url = "https://api.linkedin.com/v2/ugcPosts";

  const requestBody = {
    author: `urn:li:person:${userId}`,
    lifecycleState: "PUBLISHED",
    specificContent: {
      "com.linkedin.ugc.ShareContent": {
        shareCommentary: {
          text: postText,
        },
        shareMediaCategory:
          isVideoChosen && uploadedAssets.length === 1 ? "VIDEO" : "IMAGE",
        media: uploadedAssets.map((asset) => ({
          status: "READY",
          description: {
            text: "Uploaded via API",
          },
          media: asset.asset,
          
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
        "X-Restli-Protocol-Version": "2.0.0", 
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
