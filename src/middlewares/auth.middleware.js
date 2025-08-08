import jwt from "jsonwebtoken"
import { asynchandler } from "../utils/asynchandler.js"
import { User } from "../models/user.mode.js"
import { ApiError } from "../utils/ApiError.js"


export const VerifyJWT = asynchandler(async(req,res,next)=>{
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")

        if (!token) {
            throw new ApiError(404, "Unauthorized access")
        }

        const decodedtoken =  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const user = await User.findById(decodedtoken._id)
        if (!user) {
             throw new ApiError(401, "Invalid AccessTOken")
        }

        req.user = user
        next()
    } catch (error) {
        throw new ApiError(404,error)
    }
})