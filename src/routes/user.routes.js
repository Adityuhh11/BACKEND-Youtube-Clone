import {Router} from "express";
import { 
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeUserPassword,
    getCurrentUser,
    UpdateAccountDetails,
    updateUsercoverImage,
    updateUserAvatar,
    getUserChannelProfile,
    getWatchHistory
    } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
const router =  Router()
import { VerifyJWT } from "../middlewares/auth.middleware.js";




router.route("/register").post(
    upload.fields([
        {
            name:"avatar",
            maxCount:1
        },
        {
            name:"coverImage",
            maxCount:1
        }
    ]),
    registerUser
)

router.route("/login").post(loginUser)

//secure route
router.route("/logout").post(VerifyJWT, logoutUser)
router.route("/refreshToken").post(refreshAccessToken)
router.route("/changepassword").post(VerifyJWT,changeUserPassword)
router.route("/user").get(VerifyJWT,getCurrentUser)
router.route("/user/watchhistory").get(VerifyJWT,getWatchHistory)
router.route("/c/:username").get(VerifyJWT,getUserChannelProfile)
router.route("/updateDetails").patch(VerifyJWT, UpdateAccountDetails)
router.route("/update/Avatar").patch(VerifyJWT,upload.single("avatar"),updateUserAvatar)
router.route("/update/Avatar").patch(VerifyJWT,upload.single("coverImage"),updateUsercoverImage)

export default router