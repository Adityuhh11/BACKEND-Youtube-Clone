import { Queue } from 'bullmq';


const connection = {
    username: 'default',
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_URI,
        port: process.env.REDIS_PORT
    }
}


const videoQueue = new Queue ("videoTranscodingQueue", {connection})


export default videoQueue