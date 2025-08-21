import { Router } from "express";
const router =  Router()
import { healthcheck } from "../controllers/healthcheck.controller.js";

router.route("/health-Check").get(healthcheck)

export default router