import { Router } from "express";
const router =  Router()
import { VerifyJWT } from "../middlewares/auth.middleware.js";
import {  
    toggleVideolike,
    toggleCommentlike,
    toggleTweetlike,
    getlikedVideo } from "../controllers/like.controller.js";

    router.route("/video-like/:videoId").post(VerifyJWT,toggleVideolike)
    router.route("/comment-like/:commentId").post(VerifyJWT,toggleCommentlike)
    router.route("/tweet-like/:tweetId").post(VerifyJWT,toggleTweetlike)
    router.route("/get-like-videos").get(VerifyJWT,getlikedVideo)

    export default router