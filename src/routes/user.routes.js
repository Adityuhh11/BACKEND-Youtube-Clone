import {Router} from "express";
import { logoutUser, registerUser } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
const router =  Router()
import { loginUser } from "../controllers/user.controller.js";
import verifyJWT from "../middlewares/auth.middleware.js"
import { logoutUser } from "../controllers/user.controller.js";
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
router.route("/logout").post(verifyJWT, logoutUser)


export default router