import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-paginate-v2"



const videoSchema = new mongoose.Schema({
    videoFile: {
        type: String,
        required: true,
    },
    transcoded_videos: [
    {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
        resolution: { type: String, required: true },
        bitrate: { type: Number },
        size: { type: Number }, 
        duration: { type: Number }, 
    }
    ],
    videoPublic_id: {
        type: String,
        required: true
    },
    thumbnail: {
        type: String,
        required: true,
    },
    thumbnailPublic_id: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
        index: true
    },
    description: {
        type: String,
        required: true,
    },
    duration: {
        type: Number,
        required: true,
    },
    views: {
        type: Number,
        default: 0,
    },
    isPublished: {
        type: Boolean,
        default: true,
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    status: {
        type: String,
    }
}, { timestamps: true })

videoSchema.index({ title: 'text', description: 'text' });

videoSchema.plugin(mongooseAggregatePaginate);

export const Video = mongoose.model("Video",videoSchema)