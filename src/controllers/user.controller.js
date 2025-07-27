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

//    if ([fullName , email ,Username, password].some((field)=>field?.trim()==="")){
//     throw new ApiError(400,"All Fields are requrired")
//    }
    if (fullName === "") {
        throw new ApiError(400,"All Fields are requrired")
    } else if  (email ==="") {
        throw new ApiError(400,"All Fields are requrired")
    } else if(Username) {
        throw new ApiError(400,"All Fields are requrired")
    }else if(password) {
        throw new ApiError(400,"All Fields are requrired")
    }

   const existingUser = await User.findOne({
    $or:[{ Username }, {email}]
   })


   if (existingUser){
    throw new ApiError(409,"User with email or username aldready exists")
   }

   const avatarLocalPath = req.files?.avatar[0]?.path;
   const coverimageLocalPath = req.fields?.coverimage[0]?.path;


   if (!avatarLocalPath) {
     throw new ApiError(400, "Avatar is Required")
   }

    const avatar =await uploadOnCloudinary(avatarLocalPath)
    const coverimage =await uploadOnCloudinary(coverimageLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Avatar is Required")
    }

    const user = User.create({
        fullName, 
        avatar: avatar.url,
        coverimage : coverimage.url || "",
        email,
        Username: Username.LowerCase(),
        password
    })

    const createdUser = await User.findById(user.__id).select(

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