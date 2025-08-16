import { Router } from "express";
const router =  Router()
import { VerifyJWT } from "../middlewares/auth.middleware.js";
import { addComment,
    updateComment,
    deleteComment,
    getVideoComments } from "../controllers/comment.controller.js";

    router.route("/add-comment/:videoId").post(VerifyJWT,addComment)
    router.route("/update-comment/:commentId").post(VerifyJWT,updateComment)
    router.route("/delete-comment/:commentId").post(VerifyJWT,deleteComment)
    router.route("/video-comment/:videoId").get(VerifyJWT,getVideoComments)

    export default router