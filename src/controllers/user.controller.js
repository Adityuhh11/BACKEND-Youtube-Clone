import {asynchandler} from "../utils/asynchandler.js"
import {ApiError} from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/clouddinary.js"
import {ApiResponse} from "../utils/ApiRespons.js"
import jwt from "jsonwebtoken"
import { deleteCloudinaryFile } from "../utils/deleteCloydinary.js";



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
   const {fullName , email ,username, password} = req.body
    // console.log(req.body);
    

//    if ([fullName , email ,Username, password].some((field)=>field?.trim()==="")){
//     throw new ApiError(400,"All Fields are requrired")
//    }
    if (fullName === "") {
        throw new ApiError(400,"All Fields are requrired")
    } else if  (email ==="") {
        throw new ApiError(400,"All Fields are requrired")
    } else if(username==="") {
        throw new ApiError(400,"All Fields are requrired")
    }else if(password==="") {
        throw new ApiError(400,"All Fields are requrired")
    }

   const existingUser = await User.findOne({
    $or:[{ username }, {email}]
   })

   if (existingUser){
    throw new ApiError(409,"User with email or username aldready exists")
   }

   const avatarLocalPath = req.files?.avatar?.[0]?.path;
    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
    coverImageLocalPath = req.files.coverImage[0].path;
    }

//    const coverimageLocalPath = req.files?.coverimage?.[0]?.path;
//    console.log(req.files)
    const avatar = await uploadOnCloudinary(avatarLocalPath)
   const coverImage =await uploadOnCloudinary(coverImageLocalPath)

   if (!avatar) {
       throw new ApiError(400, "Avatar upload failed")
   }

    const user = await User.create({
        fullName, 
        avatar: avatar.url,
        avatarPublicId:avatar.public_id,
        coverImage : coverImage.url || "",
        coverImagePublicId:coverImage.public_id || "",
        email,
        username: username.toLowerCase(),
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

    const {username,email,password}= req.body 

    if (!(username || email)) {
            throw new ApiError(404, "Username or email required");
    }

    const user = await User.findOne(
       { $or: [{ username }, { email }] }
    )

    if (!user) {
        throw new ApiError(401,"User does not exist");
    }

    const isValidPassword = await user.isPasswordCorrect(password)

    if (!isValidPassword) {
        throw new ApiError(401,"Wrong User Credentials");
    }

   const{accessToken,refreshToken}=  await generateAccessTokenandRefreshToken(user._id)

   const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
   )

   const options={
    httpOnly : true,
    secure: true
   }

   return res.
   status(200)
   .cookie("accessToken",accessToken, options)
    .cookie("refreshToken",refreshToken, options)
    .json(
        new ApiResponse(200,
            "user logged in successfully",
        {
            user: loggedInUser,accessToken,refreshToken
        },
         )
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
    httpOnly : true,
    secure: true
   }

   return res
   .status(200)
   .clearCookie("accessToken", options)
   .clearCookie("refreshToken", options)
   .json(new ApiResponse(200, "User Logged out successfully "))
})

const refreshAccessToken=  asynchandler(async (req,res)=>{
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Invalid RefreshToken")    
    
    }
    const decodedToken = jwt.verify(
        incomingRefreshToken,
        process.env.REFRESH_TOKEN_SECRET
    )

    const user = await findById(decodedToken._id)
    if (!user) {
        throw new ApiError(401,"Invalid RefreshTOken")
    }

    if (incomingRefreshToken !== user.refreshToken) {
        throw new ApiError(401,"RefreshToken is expired or used")
    }

    const {accessToken, newRefreshToken}=await generateAccessTokenandRefreshToken(user._id)
    const options= {
        httpOnly:true,
        secure:true
    }
    return res
    .status(200)
    .cookie("accessToken", accessToken,options)
    .cookie("refreshToken", newRefreshToken, options)
    .json(
        new ApiResponse(
        200,
        {
            accessToken, 
            "refreshToken": newRefreshToken
        },
        "Access Token generated"
        )
    )

})

const changeUserPassword = asynchandler(async (req,res)=>{
    const {oldPassword , newPassword} = req.body
    if (!(oldPassword || newPassword)) {
        throw new ApiError(401,"Both Fields Required")
    }

    const user = await User.findById(req.user?._id)
    const isPasswrodValid = await User.isPasswordCorrect(oldPassword)

    if (!isPasswrodValid) {
        throw new ApiError(401,"Invalid old password")
    }
    
    user.password = newPassword
    await user.save({validateBeforeSave:false})

    return res
    .status(200)
    .json(
        new ApiResponse(200,{},"Password Changed Successfully")
    )
})

const UpdateAccountDetails = asynchandler(async(req,res)=>{
    const {fullName , email} =req.body
        if (!(fullName || email)) {
            throw new ApiError(401,"Both Fields Required")
        }
            const user = await User.findByIdAndUpdate(req.user?._id,{
                $set:{
                    fullName:fullName,
                    email:email
                }
            },
            {new:true}
            ).select("-password")

        return res
        .status(200)
        .json(
            new ApiResponse(200,user,"Fields changed Successfully")
        )
})

const getCurrentUser = asynchandler(async(req,res)=>{
    
    return res.status(200).json(new ApiResponse(200,req.user,"Fetched user data successfully"))

})

const updateUserAvatar = asynchandler(async(req,res)=>{
    const AvatarLocalPath = req.file?.path
    if (!AvatarLocalPath) {
        throw new ApiError(401,"Avatar File is missing")
    }
    const user = await User.findById(req.user?._id)
    if (!user) {
        throw new ApiError(404, "User not found")
    }

    const newAvatar = await uploadOnCloudinary(AvatarLocalPath)

    if (!newAvatar.url) {
        throw new ApiError(401,"Error while Uploading on avatar")
    }

    if (user.avatarPublicId) {
        await deleteCloudinaryFile(user.avatarPublicId)
    }

    const updatedUser = await User.findByIdAndUpdate(req.user?._id, {
        $set:{
            avatar:newAvatar.url,
            avatarPublicId:newAvatar.public_id
        }
     },
        {new:true }
    ).select("-password")

    return res
    .status(200)
    .json(
        new ApiResponse(200,updatedUser,"Avatar image successfully updated")
    )
})

const updateUsercoverImage = asynchandler(async(req,res)=>{
    const CoverImageLocalPath = req.file?.path
    if (!CoverImageLocalPath) {
        throw new ApiError(401,"Cover Image File is missing")
    }
     const user = await User.findById(req.user?._id)
    if (!user) {
        throw new ApiError(404, "User not found")
    }
    const coverImage = await uploadOnCloudinary(CoverImageLocalPath)

    if (!coverImage.url) {
        throw new ApiError(401,"Error while Uploading on cover Imgage")
    }
    if (user.coverImagePublicId) {
        await deleteCloudinaryFile(user.coverImagePublicId)
    }

    const updatedUser = await User.findByIdAndUpdate(req.user?._id, {
        $set:{
            coverImage:coverImage.url,
            coverImagePublicId:coverImage.public_id
        }
     },
        {new:true}
    ).select("-password")

    return res
    .status(200)
    .json(
        new ApiResponse(200,updatedUser,"cover Image  successfully updated")
    )
})
//think about merging avatar and cover image into one single utility function

const getUserChannelProfile= asynchandler(async(req,res)=>{
    const {username} = req.params

    if (!username?.trim()) {
        throw new ApiError(400,"Username required")
    }

    const channel = await User.aggregate([
        {
            $match:{
                username:username?.toLowerCase()
            }
        },
        {
            $lookup:{
                from:"subscriptions",
                localField:"_id",
                foreignField:"channel",
                as:"subscribers"
            }
        },
        {
            $lookup:{
                from:"subscriptions",
                localField:"_id",
                foreignField:"subscriber",
                as:"subscribed"
            }
        },
        {
            $addFields:{
                subscribersCount:{
                    $size:"$subscribers"
                },
                channelsSubscriberdToCount:{
                    $size:"$subscribed"
                },
                isSubscribed:{
                    $cond:{
                        if:{$in:[req.user?._id, "$subscribers.subscriber"]},
                        then:true,
                        else:false
                    }
                }
            }
        },
        {
            $project:{
                username:1,
                email:1,
                subscribersCount:1,
                channelsSubscriberdToCount:1,
                coverImage:1,
                avatar:1

            }
        }
        
    ])

    if (!channel.length) {
        throw new ApiError(404, "Channel does not exist")
    }
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            data={channel:channel[0]},
            "User data Successfully fetched")
    )
})

const getWatchHistory= asynchandler(async (req,res)=>{
    const watchHistory = User.aggregate [
        {
            $match:{
                _id: ObjectId(req.user._id)
            }
        },
        {
            $lookup:{
                from:"videos",
                localField:watchHistory,
                foreignField:_id,
                as:"watchHistory",
                pipeline: [
                    {
                        $lookup:{
                            from:"users",
                            localField:owner,
                            foreignField:_id,
                            as:"owner",
                            pipeline: [
                                {
                                    $project:
                                    {
                                        fullName:1,
                                        username:1,
                                        avatar:1,
                                    }
                                } 
                            ]
                        },
                        $addFields:{
                         $first:"$owner[0]"
                        }
                    }
                ]
            }
        }
    ]

    return res.status(200).json(
        new ApiResponse(200,User[0].watchHistory,"succesfully found the watch history")
    )
})


export {
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
}