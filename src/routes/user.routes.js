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
    updateUserAvatar
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
router.route("/refresToken").post(refreshAccessToken)
router.route("/changePassword").post(VerifyJWT,changeUserPassword)
router.route("/user").get(VerifyJWT,getCurrentUser)
router.route("/updateDetails").post(VerifyJWT, UpdateAccountDetails)
router.route("/update/Avatar").post(VerifyJWT,upload.fields([
    {
        name:"avatar",
        maxCount:1
    } 
]), 
    updateUserAvatar)
router.route("/update/coverImage").post(VerifyJWT,
    upload.fields([
    {
        name:"coverImage",
        maxCount:1
    } 
]),
     updateUsercoverImage)


export default router