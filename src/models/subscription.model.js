import mongoose, { Schema } from "mongoose";

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

export const Subscription  = MongooseError.model("Subscription",subscriptionsSchema)