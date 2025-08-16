import {asynchandler} from "../utils/asynchandler.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiRespons.js"
import { Tweet } from "../models/tweets.models.js"




const createTweet = asynchandler(async(req,res)=>{
    const {content}= req.body
    if (!content) {
        throw new ApiError(401,"content cannot be empty")
    }

    const tweet = await Tweet.create({
        content:content,
        owner:req.user?._id
    })  
    return res.status(200).json(new ApiResponse(200, tweet, "Tweet sucessfully created"))

})

const getUserTweets = asynchandler(async (req, res) => {
   const {userId} = req.params  
   const Alltweets =  await Tweet.aggregate([{
    $match:{
        owner:ObjectId(userId)
    }
   }])

    return res.status(200).json(new ApiResponse(200, Alltweets, "Tweet sucessfully fetched"))


})

const updateTweet = asynchandler(async (req, res) => {
    const {tweetId} = req.params
    const {newContent} = req.body
     if (!tweetId) {
       throw new ApiError(401,"tweet id is requrired")
    }
    if (!newContent) {
        throw new ApiError(401,"Content is requrired")
    }
    const tweet = await Tweet.findById(tweetId)
    if(!tweet){
        throw new ApiError(400,"Error finding the tweet")
    }

    if (req.user?._id.toString() !== tweet.owner.toString()) {
        throw new ApiError(402, "unauthorized request")
    }
    
    const updatedTweet = await Tweet.findByIdAndUpdate(tweetId,{
            $set:{
                content:newContent
            },
        },{new:true})

    return res.status(200).json(new ApiResponse(200, updatedTweet, "Tweet sucessfully updated"))



})

const deleteTweet = asynchandler(async (req, res) => {
    const {tweetId}= req.params
     if (!tweetId) {
       throw new ApiError(401,"tweet id is requrired")
    }
    const tweet = await Tweet.findById(tweetId)
    if(!tweet){
        throw new ApiError(400,"Error finding the tweet")
    }
    if (req.user?._id.toString() === tweet.owner.toString()) {
         await Tweet.findByIdAndDelete(tweetId)
    }else{
        throw new ApiError(402, "unauthorized request")
    }
    
     return res.status(200).json(new ApiResponse(200, {}, "Tweet sucessfully detled"))
})

export {
    createTweet,
    deleteTweet,
    updateTweet,
    getUserTweets
}