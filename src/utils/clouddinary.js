import {v2 as cloudinary} from 'cloudinary';
import fs from "fs"

cloudinary.config({
  cloud_name: process.env.CLOUDNINARY_CLOUD_NAME,
  api_key: process.env.CLOUDNINARY_YOUR_API_KEY,
  api_secret: process.env.CLOUDNINARY_YOUR_API_SECRET
});


const uploadOnCloudinary = async (localFilePath) => {
 try {
    if(!localFilePath)return null
    const response = await cloudinary.uploader.upload(localFilePath,{
      resource_type: "auto"
    })
    fs.unlinkSync(localFilePath)
    return response;

 } catch (error) {
   console.error("Cloudinary upload error:", error);
   fs.unlinkSync(localFilePath)
   return null;
 }
}

export {uploadOnCloudinary}