const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const { hashPassword, comparePassword } = require('../utils/password')

const adminSchema = new mongoose.Schema({

    username : {
        type : String,
        trim : true,
        unique : true,
        required : [true , "Username is required"]
    },

    email : {
        type : String,
        lowercase : true,
        trim : true,
        match: [
            /^\S+@\S+\.\S+$/,
            "Please enter a valid email."
        ],
        required : [true , "Email is required"],
        unique : true
    },

    password : {
        type : String,
        minlength : 8,
        required : [true , "password is required!"],
        select : false
    },

    role : {
        type : String,
        enum : ["admin" , "user"],
        default : "admin",
    }
})

adminSchema.set('toJSON' , {
    transform : function (doc , ret){
        delete ret.password;

        return ret;
    }
})

adminSchema.pre("save" , async function () {

        if(!this.isModified("password")){
            return
        }
        this.password = await hashPassword(this.password)
})

adminSchema.methods.comparePassword = async function (password) {
    return await comparePassword(password , this.password)
}

const adminModel = mongoose.model("adminPanel" , adminSchema);

module.exports = adminModel;