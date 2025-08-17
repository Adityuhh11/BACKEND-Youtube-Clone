import mongoose,{Schema} from "mongoose";

const tweetScehma = new Schema({
    content:{
        type:String,
        required:true,
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
},{timestamps:true})

tweetScehma.plugin(mongooserAggregatePaginate);


export const Tweet = mongoose.model("Tweet",tweetScehma)