import { Router } from "express";
const router =  Router()
import { VerifyJWT } from "../middlewares/auth.middleware.js";
import { getChannelStats,getChannelVideos } from "../controllers/dashboard.controller.js";

router.use(VerifyJWT)

router.route("/channel-stats/:channelId").get(getChannelStats)
router.route("/channel-stats/:channelId").get(getChannelVideos)

export default router