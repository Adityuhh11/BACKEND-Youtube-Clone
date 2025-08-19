import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asynchandler} from "../utils/asynchandler.js"



const createPlaylist = asynchandler(async (req, res) => {
    const {name, description} = req.body
    const userId = req.user?._id

    if (!name && !description) {
        throw new ApiError(401,"Name and Description is required")
    }

    const playlist = await Playlist.create ({
        name:name,
        description:description,
        owner:userId
    })

    if (!playlist) {
        throw new ApiError(500,"Error creating Playlist");
        
    }

    return res.stauts(201).json(new ApiResponse(201,playlist,"Playlist successfully created"))

})

const getUserPlaylists = asynchandler(async (req, res) => {
    const {userId} = req.params
    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "invalid User ID")
    }

    const getPlaylist = await Playlist.aggregate([
        {
            $match:{
                owner:new mongoose.Types.ObjectId(userId)
            }
        }
    ])
    if (!getPlaylist.length) {
        return res.status(200).json(new ApiResponse(200,getPlaylist,"There is not playlist for this user "))
    }

    return res.status(200).json(new ApiResponse(200,getPlaylist,"Playlist successfully fethched"))

})

const getPlaylistById = asynchandler(async (req, res) => {
    const {playlistId} = req.params
 if (!isValidObjectId(playlistId)) {
    throw new ApiError(401,"Playlist Id not valid")
 }
 const playlist = await Playlist.findById(playlistId)

 if (!playlist) {
    throw new ApiError(404,"No Playlist found with this ID")
 }

 return res.status(200).json(new ApiResponse(200,playlist,"Playlist Fetched Successfully"))
})

const deletePlaylist = asynchandler(async (req, res) => {
    const {playlistId} = req.params
    const userId = req.user?._id

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(404,"Playlist Id not valid")
    }
     const playlist = await Playlist.findById(playlistId);

    if (playlist.owner.toString() !== userId.toString()) {
        throw new ApiError(403, "Forbidden: You are not the owner of this playlist");
    }
    await Playlist.findByIdAndDelete(playlistId)

    return res.status(200).json(new ApiResponse(200,{},"Playlist successfulyl deleted"))
})

const updatePlaylist = asynchandler(async (req, res) => {
    const {playlistId} = req.params
     if (!playlistId) {
    throw new ApiError(401,"Playlist Id required")
    }
    const {name, description} = req.body
    if (!name || !description) {
        throw new ApiError(401,"Name or Description is required")
    }
      
    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }
    
    if (playlist.owner.toString() !== userId.toString()) {
        throw new ApiError(403, "Forbidden: You are not the owner of this playlist");
    }

    let update ={}

    if (name) {
        update.name = name
    }
    if (description) {
        update.description = description
    }

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $set:update
        },
        {new:true}
    )

     return res.status(200).json(new ApiResponse(200,updatedPlaylist,"Successfully updated"))



    // if (name && !description) {
    //     let updatedPlaylist = await Playlist.findByIdAndUpdate(
    //     playlistId,
    //     {
    //         $set:{
    //             name:name
    //         }
    //     },
    //     {new:true}
    // )

    // }
    // if (description && !name) {
    //     let updatedPlaylist = await Playlist.findByIdAndUpdate(
    //     playlistId,
    //     {
    //         $set:{
    //             description:description
    //         }
    //     },
    //     {new:true}
    // )

    // }
    // if (name && description) {
    //     let updatedPlaylist = await Playlist.findByIdAndUpdate(
    //     playlistId,
    //     {
    //         $set:{
    //             name:name,
    //             description:description
    //         }
    //     },
    //     {new:true}
    // )

    // }
        // return res.status(200).json(new ApiResponse(200,updatedPlaylist,"Successfully updated"))

})

export{
    getPlaylistById,
    getUserPlaylists,
    createPlaylist,
    updatePlaylist,
    deletePlaylist
}