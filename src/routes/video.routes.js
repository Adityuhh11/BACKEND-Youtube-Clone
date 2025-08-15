import { uploadVideo } from "../controllers/video.controller.js";
import { upload, videoUpload } from "../middlewares/multer.middleware.js";
import { VerifyJWT } from "../middlewares/auth.middleware.js";
import {upload} from "../middlewares/multer.middleware.js"
import { Router } from "express";
const router =  Router()


router.route("/videoupload").post(VerifyJWT,videoUpload.fields([
    {
        name:"videoFile",
        maxCount:1
    },
    {
        name:"thumbnailFile",
        maxCount:1
    }
]),uploadVideo)


export default router