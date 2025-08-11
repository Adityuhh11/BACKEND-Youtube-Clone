import {Router} from "express";
import { logoutUser, registerUser, loginUser,refreshAccessToken } from "../controllers/user.controller.js";
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
            name:"coverimage",
            maxCount:1
        }
    ]),
    registerUser
)

router.route("/login").post(loginUser)

//secure route
router.route("/logout").post(VerifyJWT, logoutUser)
router.route("/refresToken").post(refreshAccessToken)


export default router