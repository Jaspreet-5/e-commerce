const adminModel = require('../models/admin.model')
const userModel = require('../models/user.model')
const { refreshCookieOptions, accessCookieOptions } = require('../utils/cookies')
const mongoose = require('mongoose')
const createSession = require('../services/session.service')
const tokenModel = require('../models/token.model')


const adminSignup = async (req, res) => {

    const { username, email, password } = req.body

    if (!(username && email && password)) {
        return res.status(400).json({
            message: "Username , email , password is required!"
        })
    }

    try {
        const admin = await adminModel.create({
            username,
            email,
            password
        })

        const { accessToken, refreshToken } = await createSession(admin, req);

        res.cookie('a_token', accessToken, accessCookieOptions)
        res.cookie('r_token', refreshToken, refreshCookieOptions)

        return res.status(201).json({
            message: "Signup Successful",
            admin
        })

    } catch (err) {

        return res.status(500).json({
            success: false,
            message: "Some error occured",
            error: err.message
        })
    }

}

const adminLogin = async (req, res) => {

    const { username, email, password } = req.body;

    if (!((username || email) && password)) {
        return res.status(400).json({
            message: "Password , Email or Username are required!"
        })
    }

    try {

        const admin = await adminModel.findOne({
            $or: [
                { username: username },
                { email: email }
            ]
        }).select("+password");

        if (!admin || !await admin.comparePassword(password)) {
            return res.status(404).json({
                message: "User not Found with these Credentials!\nPlease Sign Up , if don't have an Account"
            })
        }

        const { accessToken, refreshToken } = await createSession(admin, req);

        res.cookie('a_token', accessToken, accessCookieOptions)
        res.cookie('r_token', refreshToken, refreshCookieOptions)


        return res.status(200).json({
            success: true,
            message: "Login Successfully!",
        })

    } catch (err) {
        return res.status(500).json({
            message: "Login Error Occured",
            error: err.message
        })
    }

}

const userSignUp = async (req, res) => {
    const { username, email, password } = req.body;

    if (!(username && email && password)) {
        return res.status(400).json({
            message: "Username , Email and Password are required!"
        })
    }

    try {

        let user;

        try {

            user = await userModel.create({
                username,
                email,
                password
            })
        }
        catch (err) {
            console.log(err);
            return res.status(409).json({
                success: false,
                message: "User Already exists with this Credentials!"
            })
        }

        const { accessToken, refreshToken } = await createSession(user, req);

        res.cookie('a_token', accessToken, accessCookieOptions)
        res.cookie('r_token', refreshToken, refreshCookieOptions)

        return res.status(200).json({
            success: true,
            message: "Sign Up Successful"
        })

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Error occured for User Sign Up!",
            error: err.message
        })
    }

}

const userLogin = async (req, res) => {

    const { username, email, password } = req.body;

    if (!((username || email) && password)) {
        return res.status(400).json({
            message: "Password , Username or Email required!"
        })
    }

    try {

        const user = await userModel.findOne({
            $or: [
                { username: username },
                { email: email }
            ]
        }).select("+password")


        if (!user || !await user.comparePassword(password)) {
            return res.status(404).json({
                message: "Invalid Credentials!"
            })
        }

        const { accessToken, refreshToken } = await createSession(user, req);

        res.cookie('a_token', accessToken, accessCookieOptions)
        res.cookie('r_token', refreshToken, refreshCookieOptions)

        return res.status(200).json({
            success: true,
            message: "Login Successful!"
        })

    } catch (err) {
        return res.status(500).json({
            message: "Some Error Occured while Login!",
            error: err.message
        })
    }
}

const userDetails = async (req, res) => {

    const user = req.user;

    return res.status(200).json({
        user
    })
}

const userLogout = async (req, res) => {

    await tokenModel.deleteOne({
        sessionId: req.user.sessionId
    })

    res.clearCookie("a_token", { path: '/' })
    res.clearCookie("r_token", { path: '/' })

    res.status(200).json({
        success: true,
        message: "User Logout Successfully!"
    })

}

const getFullUserDetails = async (req, res) => {

    const userId = req.user.id;

    if (!userId) {
        throw new AppError("user id not found!", 400);
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new AppError("User Id is not valid!", 400)
    }

    const userDetails = await userModel.findById(userId)
        .select({
            address: 1,
            phoneNo: 1,
            email: 1
        })

    if (!userDetails) {
        throw new AppError("User not found!", 404)
    }

    return res.status(200).json({
        success: true,
        message: "Details fetched Successfully!",
        userDetails
    })


}

const updateAddress = async (req, res) => {

    const { address } = req.body;

    if (!address) {
        throw new AppError("Address is required!", 400);
    }

    if (!req.user?.id) {
        throw new AppError("Invalid User!", 400);
    }

    const user = await userModel.findById(req.user.id);

    if (!user) {
        throw new AppError("User not found!", 404);
    }

    user.address = address;

    await user.save();

    return res.status(200).json({
        success: true,
        message: "Address Saved Successfully!"
    });
};

module.exports = { adminSignup, adminLogin, userSignUp, userLogin, userDetails, userLogout, getFullUserDetails, updateAddress };