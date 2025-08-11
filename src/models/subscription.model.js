import mongoose, { Schema } from "mongoose";

const subscriptionsSchema =new mongoose.Schema(
    {
        subscriber:{
            type:Schema.Types.ObjectId,
            ref:"users",
            required:true,
        },
        channel:{
            type:Schema.Types.ObjectId,
            ref:"users",
            required:true,
        }
    },
    {
        timestamps:true
    }
)

export const Subscription  = MongooseError.model("Subscription",subscriptionsSchema)