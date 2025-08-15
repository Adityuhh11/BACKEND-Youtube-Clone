import { Video } from "../models/video.model.js";
import { asynchandler } from "../utils/asynchandler.js";
import { uploadOnCloudinary } from "../utils/clouddinary.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiRespons.js";



const uploadVideo = asynchandler(async(req,res)=>{
    const {title,description} = req.body
    if (!title) {
        throw new ApiError(401,"title  required")
    }
    if (!description) {
        throw new ApiError(401,"description  required")
    }
    const user_id = req.user?._id
    const videoLocalPath  = req.fiels?.videoFile[0]?.path;
    const thumbnailLocalPath = req.files?.thumbnailFile[0]?.path;
    if (!videoLocalPath) {
        throw new ApiError(401,"Video file required")
    }
    if (!thumbnailLocalPath) {
        throw new ApiError(401,"thumbnail file required")
    }
    const video = await uploadOnCloudinary(videoLocalPath)
    if (!video.url) {
        throw new ApiError(501, "Error uploading video")
    }
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)
     if (!thumbnail.url) {
        throw new ApiError(501, "Error uploading video")
    }

    const Video_data = await Video.create({
        title:title,
        description:description,
        videoFile:video.url,
        thumbnail:thumbnail.url,
        duration:video.duration,
        owner: user_id,
        isPublished:true,

    }
    )

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
        {
        Video_data
        },
        "video uploaded successfully")
        
    )


})


export{
    uploadVideo
}