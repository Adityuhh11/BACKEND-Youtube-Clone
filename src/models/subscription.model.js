import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-paginate-v2"

const subscriptionsSchema =new mongoose.Schema(
    {
        subscriber:{
            type:Schema.Types.ObjectId,//the one who is subscribing
            ref:"User",
            required:true,
        },
        channel:{
            type:Schema.Types.ObjectId,//one to whom subscriber is subsciribing 
            ref:"User",
            required:true,
        }
    },
    {
        timestamps:true
    }
)

subscriptionsSchema.plugin(mongooseAggregatePaginate);


export const Subscription  = mongoose.model("Subscription",subscriptionsSchema)