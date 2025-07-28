import {asynchandler} from "../utils/asynchandler.js"
import {ApiError} from "../utils/ApiError.js"
import { User } from "../models/user.mode.js"
import {uploadOnCloudinary} from "../utils/clouddinary.js"
import {ApiResponse} from "../utils/ApiRespons.js"
// get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res
const registerUser =  asynchandler(async(req,res)=>{
   const {fullName , email ,Username, password} = req.body
    // console.log(req.body);
    

//    if ([fullName , email ,Username, password].some((field)=>field?.trim()==="")){
//     throw new ApiError(400,"All Fields are requrired")
//    }
    if (fullName === "") {
        throw new ApiError(400,"All Fields are requrired")
    } else if  (email ==="") {
        throw new ApiError(400,"All Fields are requrired")
    } else if(Username==="") {
        throw new ApiError(400,"All Fields are requrired")
    }else if(password==="") {
        throw new ApiError(400,"All Fields are requrired")
    }

   const existingUser = await User.findOne({
    $or:[{ Username }, {email}]
   })

   if (existingUser){
    throw new ApiError(409,"User with email or username aldready exists")
   }

   const avatarLocalPath = req.files?.avatar[0]?.path;
   const coverimageLocalPath = req.files?.coverimage?.[0]?.path;
//    console.log(req.files)

   if (!avatarLocalPath) {
     throw new ApiError(400, "Avatar is Required")
   }
   console.log("Uploading avatar from:", avatarLocalPath);
   const normalizedAvatarPath = avatarLocalPath.replace(/\\/g, "/");
   const avatar = await uploadOnCloudinary(normalizedAvatarPath);
   const coverimage =await uploadOnCloudinary(coverimageLocalPath)

   if (!avatar) {
       throw new ApiError(400, "Avatar upload failed")
   }

    const user = await User.create({
        fullName, 
        avatar: avatar.url,
        coverimage : coverimage.url || "",
        email,
        Username: Username.toLowerCase(),
        password
    })

    const createdUser = await User.findById(user._id).select(

        "-password -refreshtoken"
    )

    if (!createdUser) {
        throw new ApiError(500 , "Something went wrong while regesitering the user")
    } 

    return res.status(201).json(
        new ApiResponse(200,createdUser,"userRegisterd Successfully")
    )
})


export {registerUser}