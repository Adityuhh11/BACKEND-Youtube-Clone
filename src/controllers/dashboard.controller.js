import mongoose, { isValidObjectId } from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asynchandler} from "../utils/asynchandler.js"

const getChannelStats = asynchandler(async(requestAnimationFrame,res)=>{
    const {channelId} = req.params

    if (isValidObjectId(channelId)) {
        throw new ApiError(400, "invalid Channel ID")
    }

    const getStats = await Video.aggregate([
        
    ])
})
