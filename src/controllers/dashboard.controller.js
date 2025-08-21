import mongoose, { isValidObjectId } from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiRespons.js"
import {asynchandler} from "../utils/asynchandler.js"

const getChannelStats = asynchandler(async(req,res)=>{
    const {channelId} = req.params

    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "invalid Channel ID")
    }

    const getVidoeStats = await Video.aggregate([
        {
            $match : {
                owner:new mongoose.Types.ObjectId(channelId)
            }
        },
        {
            $group:{
                _id:null,
                totalViews: 
                {
                 $sum:"$views"
                },
                totalVideos: 
                {
                 $sum:1
                }
            }
        }
    ])
    const totalVideos = getVidoeStats[0]?.totalVideos|| 0;
    const totalViews = getVidoeStats[0]?.totalViews|| 0;

    
    const getSubscriberStats = await Subscription.aggregate([
        {
            $match : {
                channel:new mongoose.Types.ObjectId(channelId)
            }
        },
        {
            $group:{
                _id:null,
                subscribersCount : {
                    $sum:1
                }
            }
        }
    ])

    const subscribersCount = getSubscriberStats[0]?.subscribersCount || 0;

    const getLikes = await Video.aggregate([
        {
            $match:{
                owner:new mongoose.Types.ObjectId(channelId)
            }
        },
        {
            $lookup:{
                from:"likes",
                localField:"_id",
                foreignField:"video",
                as:"videoLikes"
            }
        },
         {
            $unwind:"$videoLikes"
        },
        {
            $group:{
                _id:null,
                totalLikes:{
                    $sum:1
                }
            }
        }
    ])
    const totalLikes = getLikes[0]?.totalLikes || 0;

    return res.status(200).json(
        new ApiResponse(
            200,
            {subscribersCount,
                totalLikes,
                totalVideos,
                totalViews},
            "All stats fetched successfully"))

})

const getChannelVideos = asynchandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
    const {channelId} =req.params

    const getAllvideos = await Video.find({ owner: channelId })
  .skip((page - 1) * limit)
  .limit(limit);

  if (!getAllvideos) {
    return res.status(200).json(new ApiResponse(200,{},"No Videos Uploaded by the Channel"))
  }

 return res.status(200).json(new ApiResponse(200,getAllvideos," Videos by the Channel fetched successfully"))

})


export {
    getChannelStats,
    getChannelVideos

}