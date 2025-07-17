import mongoose, {Schema} from "mongoose";
import mongooserAggregatePaginate from "mongoose-paginate-v2"



const videoSchema = new mongoose.Schema({
    videoFile:{
        type :String,
        required :true,
    },
    thumbnail:{
        type :String,
        required :true,
    },
    title:{
        type : String,
        required: true,
        index: true
    },
    description:{
        type : String,
        required: true,
    },
    duration:{
        String:Number,
        required:true,
    },
    views:{
        type:Number,
        default:0,
        required:true,
    },
    isPublished :{
        type:Boolean,
        default:true,
        required:true
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref : "owner",
        required:true,
    }
},{timestamps:true})

videoSchema.plugin(mongooserAggregatePaginate);

export const Video = mongoose.model("video",videoSchema)