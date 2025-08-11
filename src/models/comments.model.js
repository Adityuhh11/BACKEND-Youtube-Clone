import mongoose,{Schema} from "mongoose";

const commentsSchema = new Schema({
    content:{
        required:true
    },
    video:{
        type:Schema.Types.ObjectId,
        ref:"video",
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    }

},{timestamps:true})

export const Comment = mongoose.model("Comment",commentsSchema)