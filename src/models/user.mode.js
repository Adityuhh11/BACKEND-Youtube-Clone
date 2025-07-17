import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";


const UserSchema =  new mongoose.Schema (
    {
    Id:{
        type:String,
        requried: true,
    },
    username:{
        type: String,
        unique: true,
        requried:true,
        lowercase:true,
        trim:true,
        index:true,
    },
    email:{
        type: String,
        unique: true,
        requried:true,
        lowercase:true,
        trim:true,
    },
    fullName:{
        type: String,
        requried:true,
        trim:true,
        index:true,
    },
    avatar:{
        type: String,
        requried:true,
    },
    coverimage:
    {type: String,

    },
    watchHistory:{
        type: Schema.Types.ObjectId,
        ref:"Video"
    },
    password:{
        type: String,
        requried:[true , 'password is required']
    },
    refreshToken:{
        type: String,

    }
},{ timestamps: true })


UserSchema.pre("save",async function (next){
    if(!this.isModified("password")){return next()};

    this.password = bcrypt.hash(this.password, 10)
    next()
})
UserSchema.methods.isPasswordCorrect = async function(password){
   return await bcrypt.compare(password,this.password) 
}

UserSchema.methods.generateAccessToken = function(){
    jwt.sign({
        _id :this._id,
        email:this.email,
        username :this.username,
        fullName:this.fullName

    })
    process.env.ACCESS_TOKEN_SECRET,
    {
        expriesIn:process.env.ACCESS_TOKEN_EXPIRY
    }
}
UserSchema.methods.generateRefreshTokens = function(){
      jwt.sign({
        _id :this._id,
    })
    process.env.REFRESH_TOKEN_SECRET,
    {
        expriesIn:process.env.REFRESH_TOKEN_EXPIRY
    }
}


export const User = MongooseError.model("User", UserSchema)











