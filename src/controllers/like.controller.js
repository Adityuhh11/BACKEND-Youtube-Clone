import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asynchandler} from "../utils/asynchandler.js"


const getlikedVideo = asynchandler(async(req,res)=>{
    const userId = req.user?._id

    const LikedVideos = await Like.aggregate([
        {
            $match:{
                likedBy:new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $lookup:{
                from:"videos",
                localField:"video",
                foreignField:"_id",
                as:"videos",
                pipeline:[

                    {
                        $lookup:{
                            from:"users",
                            localField:"owner",
                            foreignField:"_id",
                            as:"owner",
                            pipeline:[
                                {
                                    $project:
                                    {
                                        fullName:1,
                                        username:1,
                                        avatar:1,
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $unwind: "$owner"
                    },
                    {
                     $project:
                     {
                         videoPublic_id:0,
                         thumbnailPublic_id:0
                     }
                    }
                ]
            }
        }
    ])

    if (LikedVideos.length === 0) {
        // throw new ApiError(401,"No Liked Videos Found")
        return res.status(200).json(new ApiResponse(200, LikedVideos, "No Liked Videos Found"));
    }

    return res.status(200).json(new ApiResponse(200,LikedVideos,"Liked Videos Found Successfully"))
})

const toggleVideolike = asynchandler(async(req,res)=>{
    const {videoId} = req.params
    if (!isValidObjectId(videoId)) {
        throw new ApiError(401,"invalid Video ID")
    }
    const userId = req.user?._id

    const like = await Like.findOne({
        video:videoId,
        likedBy:userId
    })
    let message = ""
    let result = {}
    if (like) {
        await Like.findByIdAndDelete(like._id)
        message="Video Like removed Successfully"
    }else{
        const UpdatedLike = await Like.create({
            video:videoId,
            likedBy:userId
        })
        message="video Liked successfully"
        result=UpdatedLike

    }

    return res.status(200).json(new ApiResponse(200,result,message))

})

const toggleCommentlike = asynchandler(async(req,res)=>{
    const {commentId} = req.params
      if (!isValidObjectId(commentId)) {
        throw new ApiError(401,"invalid Video ID")
    }
    const userId = req.user?._id

    const like = await Like.findOne({
        comment:commentId,
        likedBy:userId
    })
    let message = ""
    let result = {}
    if (like) {
        await Like.findByIdAndDelete(like._id)
        message="comment Like removed Successfully"
    }else{
        const UpdatedLike = await Like.create({
            video:videoId,
            likedBy:userId
        })
        message="comment Liked successfully"
        result=UpdatedLike

    }

    return res.status(200).json(new ApiResponse(200,result,message))
})

const toggleTweetlike = asynchandler(async(req,res)=>{
    const {tweetId} = req.params
      if (!isValidObjectId(tweetId)) {
        throw new ApiError(401,"invalid Video ID")
    }
    const userId = req.user?._id

    const like = await Like.findOne({
        tweet:tweetId,
        likedBy:userId
    })
    let message = ""
    let result = {}
    if (like) {
        await Like.findByIdAndDelete(like._id)
        message="tweet Like removed Successfully"
    }else{
        const UpdatedLike = await Like.create({
            video:videoId,
            likedBy:userId
        })
        message="tweet Liked successfully"
        result=UpdatedLike

    }

    return res.status(200).json(new ApiResponse(200,result,message))
})




export {
    toggleVideolike,
    toggleCommentlike,
    toggleTweetlike,
    getlikedVideo
}
