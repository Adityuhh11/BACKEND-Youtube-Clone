import {asynchandler} from "../utils/asynchandler.js"
import {ApiError} from "../utils/ApiError.js"
import { User } from "../models/user.mode.js"
import {uploadOnCloudinary} from "../utils/clouddinary.js"
import {ApiResponse} from "../utils/ApiRespons.js"
import verifyJWT from "../middlewares/auth.middleware.js"

const generateAccessTokenandRefreshToken =  async(userId)=>{

   try {
     const user= await User.findById(userId)
     const accessToken =  user.generateAccessToken()
     const refreshToken = user.generateRefreshTokens()
     
     user.refreshToken= refreshToken
     await user.save({ validateBeforeSave : false})

     return {accessToken,refreshToken}
   } catch (error) {
    throw new ApiError(500,error);
    
   }

}




const registerUser =  asynchandler(async(req,res)=>{
    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res
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

   const avatarLocalPath = req.files?.avatar?.[0]?.path;
    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverimage) && req.files.coverimage.length > 0) {
    coverImageLocalPath = req.files.coverimage[0].path;
    }

//    const coverimageLocalPath = req.files?.coverimage?.[0]?.path;
//    console.log(req.files)
    const avatar = await uploadOnCloudinary(avatarLocalPath)
   const coverimage =await uploadOnCloudinary(coverImageLocalPath)

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

const loginUser = asynchandler(async(req,res)=> {
    // get data from the req.body
    // take username or email, password
    // validate if it is empty or not 
    // validate if it is in proper format
    //find the username email in DB 
    //if none return user not found try again with correct info 
    //check with the DB find the password 
    //compare the password and given password in DB 
    //give refresh token 
    //then create a access token from the refresh token and give it the user 
    //then route the user back to the homepage.

    const {Username,email,password}= req.body 

    if (!Username || !email) {
            throw new ApiError(404, "Username or email required");
    }

    const user = await User.findOne(
        $or[{Username}, {email}]
    )

    if (!user) {
        throw new ApiError(401,"User does not exist");
    }

    const isValidPassword = await user.isPasswordCorrect(password)

    if (!isValidPassword) {
        throw new ApiError(401,"Wrong User Credentials");
    }

   const{accessToken,refreshToken}=  generateAccessTokenandRefreshToken(user._id)

   const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
   )

   const options={
    httpsOnly : true,
    secure: true
   }

   return res.
   status(200)
   .cookie("accessToken",accessToken, options)
    .cookie("refreshToken",refreshToken, options)
    .json(
        new ApiResponse(200,
        {
            user: loggedInUser,accessToken,refreshToken
        },
         "user logged in successfully",)
    )


})


const logoutUser = asynchandler(async(req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,{
            $set:{
                refreshToken: undefined
            }
        },
        {
            new:true
        })

    const options=
    {
    httpsOnly : true,
    secure: true
   }

   return res
   .status(200)
   .clearCookie("accessToken", accessToken)
   .clearCookie("refreshToken", refreshToken)
   .json(new ApiResponse(200, "User Logged out successfully "))
})


export {
    registerUser,
    loginUser,
    logoutUser
}