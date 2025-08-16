import {asynchandler} from "../utils/asynchandler.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiRespons.js"
import { Subscription } from "../models/subscription.model.js"
import mongoose  from "mongoose";



const toggleSubscription = asynchandler(async (req, res) => {
    const {channelId} = req.params
    const userId = req.user?._id
    
   if (!channelId || !mongoose.Types.ObjectId(channelId)) {
        throw new ApiError(401,"Channel ID is required")
    }

    let message=""
    let result ={}

    const subscription = await Subscription.findOne(
        {
        channel:channelId,
        subscriber:userId
        }
    )
    // const channel = await Subscription.aggregate([
    //     {
    //         $match:{
    //             subscriber:new mongoose.Types.ObjectId(userId),
    //             channel:new mongoose.Types.ObjectId(channelId)
    //         }
    //     }
    // ])

    if (subscription) {
    //   await Subscription.deleteOne( { channel: new mongoose.Types.ObjectId(channelId) } )
    //   return res.stauts(200).json(new ApiResponse(200,{},"Successfully unsubscribed"))
     await Subscription.findByIdAndDelete(subscription._id);
        message = "Successfully unsubscribed";
        result = { subscriptionStatus: false };
    }else{const newSubscription = await Subscription.create(
        {
        subscriber:userId,
        channel:channelId
        })
        message= "Successfully subscribed";
        result = {newSubscription}
    }
    return res.stauts(200).json(new ApiResponse(200,result,message))
})
const getChannelSubscribers = asynchandler(async(req,res)=>{
    const {channelId}= req.params

    if (!channelId || !mongoose.Types.ObjectId(channelId)) {
        throw new ApiError(401,"Channel ID is required")
    }

    const subscribers = await Subscription.aggregate([
    {   $match:{
            channel: new mongoose.Types.ObjectId(channelId)
        }
    },
    {
            
            $lookup: {
                from: "users",
                localField: "subscriber",
                foreignField: "_id",
                as: "subscriberDetails"
            }
        },
        {
           
            $unwind: "$subscriberDetails"
        },
        {
            
            $project: {
                _id: 0, 
                username: "$subscriberDetails.username",
                avatar: "$subscriberDetails.avatar"
            }
        }
    ])

    const subscriberCount = subscriptions.length
    return res.stauts(200).json(
        new ApiResponse(200,{subscriberCount, subscribers} ,"Subscribers fetched")
    )
})
const getSubscribedChannels = asynchandler(async (req, res) => {
    const { subscriberId } = req.params

    if (!subscriberId || !new mongoose.Types.ObjectId(subscriberId)) {
        throw new ApiError(401, "correct Subscriber Id is required")
    }

    const subscription = await Subscription.aggregate([
        {
            $match:{
                subscriber: new mongoose.Types.ObjectId(subscriberId)
            }
        },
        {
            $lookup:{
                from:"users",
                localField:"channel",
                foreignField:"_id",
                as:"channelDetails"
            }
        },
        {
            $unwind:"channelDetails"
        },
        {
            $project:{
                _id:0,
                username:"$channelDetails.username",
                avatar:"$channelDetails.avatar"
            }
        }
        
    ])
    
    const subscriptionCount = subscription.length
    return res
    .status(200)
    .json(new ApiResponse(200,{subscriptionCount,subscription }, "Channels and count fetched successfully "))

})

export {
    getChannelSubscribers,
    toggleSubscription,
    getSubscribedChannels

}