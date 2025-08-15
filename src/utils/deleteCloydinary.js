import {v2 as cloudinary} from 'cloudinary';
import fs from "fs"
import { ApiError } from './ApiError.js';

cloudinary.config({
  cloud_name: process.env.CLOUDNINARY_CLOUD_NAME,
  api_key: process.env.CLOUDNINARY_YOUR_API_KEY,
  api_secret: process.env.CLOUDNINARY_YOUR_API_SECRET
});

const deleteCloudinaryFile = async (publicId)=>{
   try {
     if (!publicId) {
         throw new ApiError(500,"public id required")
     }
    const result = await cloudinary.uploader.destroy(publicId)
 
    if (result.result !== "ok") {
      console.error(`Error deleting from Cloudinary: ${result.result}`);
     throw new ApiError(500, "Failed to delete old resource from Cloudinary.");
    }
    return result;

   } catch (error) {
     console.error("Cloudinary upload error:", error);
     
     return null
   }

}

export {deleteCloudinaryFile};