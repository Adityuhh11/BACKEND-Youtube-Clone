
import Ffmpeg from "fluent-ffmpeg";
import { uploadOnCloudinary } from "./cloudinary.js";
import downloadFile from "./downloadCloudinary.js";
import fs from "fs";
import path from "path";
import os from "os";
import crypto from "crypto";

const Transcoding = async (videoUrl) => {
    const tempDirectory = os.tmpdir();
    const uniqueId = crypto.randomUUID();
    const inputFilePath = path.join(tempDirectory, `${uniqueId}_original.mp4`);
    const transcodedOutputs = [];
    let videoDuration = 0; 

    const resolutions = [
        { width: 1920, height: 1080, name: '1080p', bitrate: '5000k' },
        { width: 1280, height: 720, name: '720p', bitrate: '2500k' },
        { width: 854, height: 480, name: '480p', bitrate: '1000k' }
    ];

    try {
        await downloadFile(videoUrl, inputFilePath);


        videoDuration = await new Promise((resolve, reject) => {
            Ffmpeg.ffprobe(inputFilePath, (err, data) => {
                if (err) return reject(err);
                resolve(data.format.duration);
            });
        });

        await new Promise((resolve, reject) => {
            const command = Ffmpeg(inputFilePath);

            resolutions.forEach(res => {
                const outputFileName = `${uniqueId}_${res.name}.mp4`;
                const outputPath = path.join(tempDirectory, outputFileName);
                
                transcodedOutputs.push({
                    resolution: res.name,
                    path: outputPath
                });

                command.addOutput(outputPath)
                    .size(`${res.width}x${res.height}`)
                    .videoCodec('libx264')
                    .audioCodec('aac')
                    .videoBitrate(res.bitrate)
                    .outputOptions(['-movflags frag_keyframe+empty_moov']); 
            });

            command.on('end', () => {
                console.log('Transcoding finished successfully.');
                resolve();
            });

            command.on('error', (err) => {
                console.error('Error during transcoding:', err.message);
                reject(err);
            });

            command.run();
        });

        const finalResults = [];
        for (const output of transcodedOutputs) {
            const stats = fs.statSync(output.path);
            const sizeInBytes = stats.size;

            const result = await uploadOnCloudinary(output.path);
            finalResults.push({
                resolution: output.resolution,
                url: result.url,
                publicId: result.public_id,
                size: sizeInBytes,
                duration: videoDuration,
            });
            fs.unlinkSync(output.path);
        }

        fs.unlinkSync(inputFilePath);

        return finalResults; 

    } catch (error) {
        console.error("Transcoder utility error:", error);
        if (fs.existsSync(inputFilePath)) fs.unlinkSync(inputFilePath);
        for (const output of transcodedOutputs) {
            if (fs.existsSync(output.path)) fs.unlinkSync(output.path);
        }
        throw error;
    }
};

export default Transcoding;