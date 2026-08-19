const mongoose = require('mongoose')
const hashToken = require('../utils/hasing')


const tokenSchema = new mongoose.Schema({

    userId: {
        type : mongoose.Schema.Types.ObjectId,
        required : true
    },

    sessionId : {
        type : String,
        required : [true , "Session Id is required!"],
        unique: true
    },

    userIP : {
        type : String,
        required : true
    },
    
    userAgent : {
        type : String
    },

    refreshToken : {
        type : String,
        required : [true , "Refresh Token is required!"]
    },

    expiresAt : {
        type : Date,
        required : true,
        expires : 0
    }

} , {timestamps : true})


tokenSchema.index({userId : 1 , sessionId : 1})

tokenSchema.pre("save" , async function () {
    if(!this.isModified("refreshToken")){
        return
    }
    this.refreshToken = await hashToken.hashing(this.refreshToken)
    
})

tokenSchema.methods.verifyToken = async function (token) {
    return await hashToken.compareHasing(token , this.refreshToken)
}

const tokenModel = mongoose.model("tokens" , tokenSchema);

module.exports = tokenModel