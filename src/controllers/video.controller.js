import { Video } from "../models/video.model.js";
import { asynchandler } from "../utils/asynchandler.js";
import { uploadOnCloudinary } from "../utils/clouddinary.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiRespons.js";
import { deleteCloudinaryFile } from "../utils/deleteCloydinary.js";
import mongoose from "mongoose";

const getAllVideos = asynchandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    const pipeline=[]
    const match ={}
    if (query) {
            match.$or=[
                {title :{$regex:query, $options:'i'}},
                {description :{$regex:query, $options:'i'}}
            ]
    }

    if(!userId){
       throw new ApiError(400, "Invalid userId ");
    }
    match.owner = new mongoose.Types.ObjectId(userId);
    match.isPublished = true;

    if (Object.keys(match).length>0) {
        pipeline.push({$match:match});
    }

    const sortStage = {};

    if (sortBy && sortType) {
        const validSortFields= ['views','createdAt', 'diuration'];
        if (!validSortFields.includes(sortBy)) {
        throw new ApiError(400, `Invalid sortBy field : ${sortBy}`);

        }

        if (sortType === 'asc') {
            sortOder = 1;
        }else{
            sortOrder= -1
        }

        sortStage[sortBy] = sortOder
        pipeline.push({$sort : sortStage});

    }

    pipeline.push({
        $lookup: {
            from: "users",
            localField: "owner", 
            foreignField: "_id",
            as: "owner" 
        }
    });

    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: parseInt(limit) });


    const searchedVideos = await Video.aggregate(pipeline);
    return res.status(200).json(new ApiResponse(200,searchedVideos,"sucessfully sorted"))
    
})

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
        videoPublic_id:video.public_id,
        thumbnail:thumbnail.url,
        thumbnailPublic_id:thumbnail.public_id,
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

const getVideoById = asynchandler(async (req, res) => {
    const { videoId } = req.params
    if (!videoId) {
        throw new ApiError(401,"Video ID required")
    }

    const video = await Video.findById(videoId)
    if (!video) {
        throw new ApiError(401,"Video does not exist")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200,video,"Video Successfully fetched")
    )
})

const updateVideodetails = asynchandler(async (req, res) => {
    const { videoId } = req.params
     if (!videoId) {
        throw new ApiError(401,"Video ID required")
    }
    const {newTitle, newDescription} = req.body

    if (!newTitle && !newDescription) {
        throw new ApiError(401,"Atleast title or desciprtion required")
    }
    const updateFields= {}
    if (newTitle) {
        updateFields.title = newTitle
    } 
    if(newDescription){
        updateFields.description=newDescription
    }
    //  if (!newTitle) {
    //     throw new ApiError(401,"title  required")
    // }
    // if (!newDescription) {
    //     throw new ApiError(401,"description  required")
    // }


     const updatedVideo = await Video.findByIdAndUpdate(
        videoId,
        { $set: updateFields },
        { new: true, runValidators: false }
    );

 return res
 .status(200)
 .json(
    new ApiResponse(200,updatedVideo,"Successfully updated")
 )


})

const updateVideothumbnail = asynchandler (async(req,res)=>{
     const { videoId } = req.params
     if (!videoId) {
        throw new ApiError(401,"Video ID required")
    }
    const newThumbnailLocalpath = req.file?.path;
    if (!newThumbnailLocalpath) {
        throw new ApiError(401,"thumbnail  required")
    }
    const video = await Video.findById(videoId)
    if (!video) {
        throw new ApiError(401,"Video not found")
    }
    const newThumbnail = await uploadOnCloudinary(newThumbnailLocalpath)
     if (!newThumbnail.url) {
        throw new ApiError(500, "Error uploading video")
    }
    if(video.thumbnailPublic_id){
        await deleteCloudinaryFile(Video.thumbnailPublic_id)
    }
    const updatedVideo = await Video.findByIdAndUpdate(videoId,{
        $set:{
            thumbnail:newThumbnail.url,
            thumbnailPublic_id:newThumbnail.public_id
        }}
        ,{ new: true}
    )

    return res
    .status(200)
    .json(
        new ApiResponse(200,updatedVideo,"succsesfully updated thumbnail")
    )
})

const deleteVideo = asynchandler(async (req, res) => {
    const { videoId } = req.params
    if (!videoId) {
        throw new ApiError(400,"Video ID required")
    }
   const video = await Video.findById(videoId)
   if (!video) {
        throw new ApiError(402,"Video not found")
    }

    if (video.thumbnailPublic_id) {
        await deleteCloudinaryFile(video.thumbnailPublic_id)
    }
    if (video.videoPublic_id) {
        await deleteCloudinaryFile(video.videoPublic_id)
    }

    await Video.findByIdAndDelete(videoId)
return res
.status(200)
.json(new ApiResponse(200,null,"Successfully deleted"))
})


const togglePublishStatus = asynchandler(async (req, res) => {
    const { videoId } = req.params
    
    const video = await Video.findById(videoId)

    // if (video.isPublished = 'true') {
    //     video.isPublished = false
    //      await Video.save({ validateBeforeSave: false }) 
    // }else{
    //     video.isPublished = true
    //      await Video.save({ validateBeforeSave: false }) 
    // }
    const  updatedVideo = await Video.findByIdAndUpdate(videoId,
        {
            $set:{
                isPublished:!video.isPublished
            }
        }
        ,{new:true}
    )
    let message;
    if (updatedVideo.isPublished) {
        message = "Video successfully published";
    } else {
        message = "Video successfully made private";
    }
    return res.status(200)
    .json(new ApiResponse(200,updatedVideo,message))
})
export{
    uploadVideo,
    getVideoById,
    updateVideodetails,
    updateVideothumbnail,
    deleteVideo,
    togglePublishStatus,
    getAllVideos
}