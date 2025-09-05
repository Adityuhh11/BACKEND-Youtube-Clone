import { Worker } from "bullmq";
import { Video } from "../models/video.model";
import Transcoding from "../utils/transcoder";

const videoTranscodingWorker = new Worker ("videoTranscodingQueue", async(job)=>{
    const { videoId } = job.data;
    console.log(`Started Video Transcoding For video ${videoId}`);
    try {
        const video = await Video.findById(videoId);
        if (!video) {
            throw new Error(`Video document not found for id: ${videoId}`);
        }        
        const transcodedVideos = await Transcoding(video.videoFile);

        // Update the video document with transcoded video info
        video.status = "completed"
        video.transcoded_videos = transcodedVideos; // or use the appropriate field
        await video.save();

    } catch (error) {

        console.error(`Transcoding failed for video ${videoId}:`, error);
        await Video.findByIdAndUpdate(videoId, { status: "failed" });
    }


})
console.log("Transcoding worker is ready to process jobs.");

export default videoTranscodingWorker