import mongoose,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-paginate-v2"

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

tweetScehma.plugin(mongooseAggregatePaginate);


export const Tweet = mongoose.model("Tweet",tweetScehma)