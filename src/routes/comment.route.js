import { Router } from "express";
const router =  Router()
import { VerifyJWT } from "../middlewares/auth.middleware.js";
import { addComment,
    updateComment,
    deleteComment,
    getVideoComments } from "../controllers/comment.controller.js";

    router.use(VerifyJWT)
    router.route("/add-comment/:videoId").post(addComment)
    router.route("/update-comment/:commentId").patch(updateComment)
    router.route("/delete-comment/:commentId").delete(deleteComment)
    router.route("/video-comment/:videoId").get(getVideoComments)

    export default router