import {  
    uploadVideo,
    getVideoById,
    updateVideodetails,
    updateVideothumbnail,
    deleteVideo,
    togglePublishStatus,
    getAllVideos } from "../controllers/video.controller.js";
import { upload, videoUpload } from "../middlewares/multer.middleware.js";
import { VerifyJWT } from "../middlewares/auth.middleware.js";
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

router.route("/Video/:videoId").get(VerifyJWT,getVideoById)
router.route("/updateVideo/:videoId").post(VerifyJWT,updateVideodetails)
router.route("/updateThumbnail/:videoId").post(VerifyJWT,upload.single("thumbnail"),updateVideothumbnail)
router.route("/deleteVideo/:videoId").post(VerifyJWT,deleteVideo)
router.route("/updatePublication/:videoId").post(VerifyJWT,togglePublishStatus)
router.route("/getVideos").get(VerifyJWT,getAllVideos)


export default router