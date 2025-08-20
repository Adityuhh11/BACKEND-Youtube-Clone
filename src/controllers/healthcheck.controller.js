import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import mongoose from "mongoose"


const healthcheck = asyncHandler(async (req, res) => {
    //TODO: build a healthcheck response that simply returns the OK status as json with a message
    try {

        const serverStatus = "OK"
        const dbStatus = mongoose.connection.readyState === 1 ? "OK" : "Error";
        //no external API to check for now 
        const externalAPI = "OK"
        return res.status(200).json(new ApiResponse(200,
            {
            server:serverStatus,
            DBstatus:dbStatus,
            externalAPI:externalAPI
        }
        ,"Application is healthy"))
    } catch (error) {
     throw new ApiError(500, "Health check failed", error.message);
    }
})

export {
    healthcheck
    }