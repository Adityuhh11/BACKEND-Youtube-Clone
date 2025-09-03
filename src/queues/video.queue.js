import { createClient } from 'redis';
import { Queue } from 'bullmq';


const connection = {
    username: 'default',
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_URI,
        port: 16030
    }
}


const videoQueue = new Queue ("videoTranscodingQueue", {connection})


export default videoQueue