import express from 'express';
import cors from "cors";
import cookieParser from 'cookie-parser';
const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials:true,
}))
app.use(express.json({limit:"15kb"}));
app.use(express.urlencoded({extended:true, limit:"16kb"}))
app.use(express.static("public"))

app.use(cookieParser())
//importing routes
import userRoutes from './routes/user.routes.js';
import videoRoutes from './routes/video.routes.js';
import tweetRoutes from '.routes/tweet.route.js'
import subscriptionRoutes from '.routes/subscription.route.js'
import commentRoutes from '.routes/comment.route.js'
import likedRoutes from '.routes/like.route.js'


app.use("/api/v1/users", userRoutes)
app.use("/api/v1/videos",videoRoutes)
app.use("/api/v1/tweets",tweetRoutes)
app.use("/api/v1/subscription",subscriptionRoutes)
app.use("/api/v1/comments",commentRoutes)
app.use("/api/v1/likes",likedRoutes)



export {app}