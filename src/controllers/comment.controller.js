import {asynchandler} from "../utils/asynchandler.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiRespons.js"
import { Comment } from "../models/Comment.js";
import mongoose, {isValidObjectId} from "mongoose"


const getVideoComments = asynchandler(async (req, res) => {
    const {videoId} = req.params
     if (!videoId) {
        throw new ApiError(401,"Video Id Not found")
    }
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid Video ID");
    }
    const {page = 1, limit = 10} = req.query
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const Allcomments= await Comment.aggregate([
        {
            $match:{
                video:videoId
            }
        },
        {
            $lookup:{
                from:"users",
                localfield:"owner",
                foreignfield:"_id",
                as:"commentDetails"
            }
        },
        {
            $unwind:"$commentDetails"
        },
        {
            $project:{
                _id: 1, 
                content: 1, 
                username: "$commentDetails.username",
                avatar: "$commentDetails.avatar",
                createdAt: 1,
            }
        },
        { 
            $skip: skip 
        },
        { 
            $limit: parseInt(limit) 
        }

    ])

    return res.status(200).json(new ApiResponse(200,Allcomments,"All comments sucessfully fetched"))

})
const addComment = asynchandler(async (req, res) => {
    const {videoId} = req.params
    if (!videoId) {
        throw new ApiError(401,"Video Id Not found")
    }
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid Video ID");
    }
    const userId = req.user?._id
    const {content}  = req.body
    if (!content) {
        throw new ApiError(401,"comment is required")
    }

    const comment = await Comment.create({
        content:content,
        video:videoId,
        owner:userId
    })

    return res
    .status(200)
    .json(new ApiResponse(200, comment, "Comment successfull"))

})

const updateComment = asynchandler(async (req, res) => {
    const {commentId} = req.params
    if (!commentId) {
        throw new ApiError(401,"comment Id Not found")
    }
    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment ID");
    }
    const userId = req.user?._id
    const {newContent}  = req.body
    if (!newContent) {
        throw new ApiError(401,"comment is required")
    }

    const comment = await Comment.findById(commentId)

    if (userId.toString() !== comment.owner.toString()) {
        throw new ApiError(402,"Unauthorized request")
    }
    const updatedComment = await Comment.findByIdAndUpdate(commentId,{
        $set:{
            comment:newContent
        }
    })

    return res
    .status(200)
    .json(200,updatedComment,"Comment successfully updated")


})

const deleteComment = asynchandler(async (req, res) => {
      const {commentId} = req.params
    if (!commentId) {
        throw new ApiError(401,"comment Id Not found")
    }
    const userId = req.user?._id
    const comment = await Comment.findById(commentId)

    if (userId.toString() !== comment.owner.toString()) {
        throw new ApiError(402,"Unauthorized request")
    }

    await Comment.findByIdAndDelete(commentId)

    return res.status(200).json(200,{},"comment successfully deleted")
})

export{
    addComment,
    updateComment,
    deleteComment,
    getVideoComments
}