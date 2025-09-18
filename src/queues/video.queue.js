import dotenv from 'dotenv';
dotenv.config();
import { Queue } from 'bullmq';

console.log("--- SANITY CHECK: video.queue.js IS RUNNING ---");

const connection = {
    host: process.env.REDIS_HOST,
    port: 16030, 
    password: process.env.REDIS_PASSWORD,
}
// This will print the values you hardcoded above
console.log(`--- CONNECTING WITH: Host='${connection.host}', Port=${connection.port} ---`);

const videoQueue = new Queue("videoTranscodingQueue", { connection });

videoQueue.on('error', err => {
  console.error('--- BullMQ Queue Error ---:', err);
});

export default videoQueue;