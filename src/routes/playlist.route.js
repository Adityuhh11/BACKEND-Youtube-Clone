import { Router } from "express";
const router =  Router()
import { VerifyJWT } from "../middlewares/auth.middleware.js";
import {  
    getPlaylistById,
    getUserPlaylists,
    createPlaylist,
    updatePlaylist,
    deletePlaylist,
    removeVideoFromPlaylist,
    addVideoPlaylist } from "../controllers/playlist.controller.js";

router.use(VerifyJWT)

router.route("/get-playlist/:playlistId").get(getPlaylistById)
router.route("/user-playlist/:userId").get(getUserPlaylists)
router.route("/create-playlist").post(createPlaylist)
router.route("/update-playlist/:playlistId").post(updatePlaylist)
router.route("/delete-playlist/:playlistId").post(deletePlaylist)
router.route("/add-video-playlist/:playlistId/:videoId").post(addVideoPlaylist)
router.route("/delete-video-playlist/:playlistId/:videoId").post(removeVideoFromPlaylist)


export default router


