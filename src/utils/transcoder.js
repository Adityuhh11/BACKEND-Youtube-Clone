import { asynchandler } from "./asynchandler.js";
import { Video } from "../models/video.model.js";
import Ffmpeg from "fluent-ffmpeg";
const Transcoding = asynchandler(async (videoId) =>{
    const video = await Video.findById(videoId)

    const video_url = video.videoFile
    
})

export default Transcoding