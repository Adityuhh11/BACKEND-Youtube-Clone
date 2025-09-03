import { Worker } from "bullmq";
import { Video } from "../models/video.model";
import Transcoding from "../utils/transcoder";
import os from 'os';
import crypto from 'crypto';
import downloadFile from "../utils/downloadCloudinary";

const videoTranscodingWorker = new Worker ("videoTranscodingQueue", async(job)=>{
    const { videoId } = job.data;
    console.log(`Started Video Transcoding For video ${videoId}`);
    try {
        const tempDirectory = os.tmpdir();
        const uniqueFileName = crypto.randomUUID() + '.mp4'; 
        const tempFilePath = path.join(tempDirectory, uniqueFileName);
        console.log(`Downloading video to temporary path: ${tempFilePath}`);

        await downloadFile(videoUrl, tempFilePath);

        const video = await Video.findById(videoId);
        const video_url = video.videoFile;
        const transcodedVideos = await Transcoding(videoId);

        // Update the video document with transcoded video info
        video.transcoded_videos = transcodedVideos; // or use the appropriate field
        await video.save();
    } catch (error) {
        console.error(`Transcoding failed for video ${videoId}:`, error);
    }


})
console.log("Transcoding worker is ready to process jobs.");