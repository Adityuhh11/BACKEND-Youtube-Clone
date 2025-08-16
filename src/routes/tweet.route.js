import { Router } from "express";
const router =  Router()
import { VerifyJWT } from "../middlewares/auth.middleware.js";
import {  
    createTweet,
    deleteTweet,
    updateTweet,
    getUserTweets} from "../controllers/tweet.controller.js";

router.route("/create-tweet").post(VerifyJWT,createTweet)
router.route("/delete-tweet/:tweetId").post(VerifyJWT,deleteTweet)
router.route("/updadte-tweet/:tweetId").post(VerifyJWT,updateTweet)
router.route("/user-tweet/:userId").get(VerifyJWT,getUserTweets)

export default router