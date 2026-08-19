const mongoose = require('mongoose')
const { hashPassword, comparePassword } = require('../utils/password')
const tokenModel = require('./token.model')

const userSchema = new mongoose.Schema({

    username: {
        type: String,
        trim: true,
        required: [true, "Username is required!"],
        unique: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [
            /^\S+@\S+\.\S+$/,
            "Please enter a valid email."
        ]
    },

    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: 8,
        select: false
    },

    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },

    phoneNo: {
        type: String,
        validate: {
            validator: function (value) {
                if (value == null || value === "") return true;
                return /^[0-9]{10}$/.test(value)
            },
            message: "Please enter a valid Phone Number!"
        }, unique: true,
        sparse: true,
        select: false
    },

    address: {
        name: {
            type: String,
            trim: true
        },
        phoneNo: {
            type: String,
            trim: true
        },
        email: {
            type: String,
            trim: true
        },
        area: {
            type: String,
            trim: true
        },
        pincode: {
            type: String,
            trim: true
        },
        city: {
            type: String,
            trim: true
        },
        state: {
            type: String,
            trim: true
        },
        country: {
            type: String,
            trim: true
        }
    }
}, { timestamps: true })


userSchema.set("toJSON", {
    transform: function (doc, ret) {
        delete ret.phoneNo;
        delete ret.password;
        return ret;
    }
})


userSchema.pre("save", async function () {

    if (!this.isModified("password")) {
        return
    }
    this.password = await hashPassword(this.password)
})

userSchema.methods.comparePassword = async function (password) {
    return await comparePassword(password, this.password)
}

const userModel = mongoose.model('users', userSchema);

module.exports = userModel;