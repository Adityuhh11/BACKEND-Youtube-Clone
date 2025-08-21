import { Router } from "express";
const router =  Router()
import { VerifyJWT } from "../middlewares/auth.middleware.js";
import {   
    getChannelSubscribers,
    toggleSubscription,
    getSubscribedChannels } from "../controllers/subscription.controller.js";


     router.route("/subscribe/:channelId").post(VerifyJWT,toggleSubscription)
     router.route("/channel-subscribers").get(VerifyJWT,getChannelSubscribers)
     router.route("/subscribed-channels").get(VerifyJWT,getSubscribedChannels)

     export default router
