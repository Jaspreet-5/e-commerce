const tokenModel = require("../models/token.model")
const { verifyTokens, generateAccessToken, generateRefreshToken } = require("../utils/token")
const { accessCookieOptions, refreshCookieOptions } = require("../utils/cookies")
const AppError = require("../utils/appError")
const createSession = require('../services/session.service')


const rotateTokens = async (req, res) => {

    const refreshToken = req.cookies.r_token

    if (!refreshToken) {
        console.log("Refresh token not found")
        throw new AppError("Refresh Token not found!" , 401)
    }

    try {

        //checking if token is tampered
        const decoded = await verifyTokens(refreshToken)


        //authenticating user, based on user id with help of decoded variable
        const tokenUser = await tokenModel.findOne({
            userId: decoded.id,
            sessionId: decoded.sessionId
        })

        if (!tokenUser) {
            throw new AppError("Token not avaible! Login required" , 403)
        }

        //checking, refreshToken is same after hashing || checking, the current hashed refreshed token with stored hashed refresh token
        const isTokenValid = await tokenUser.verifyToken(refreshToken) //here, verifyToken is mongoose document object method

        if (!isTokenValid) {
            throw new AppError("Invalid refresh token" , 401);
        }

        const payload = {
            sessionId: decoded.sessionId,
            role: decoded.role,
            id: decoded.id
        };

        //generating new tokens and rotating it :

        const newAccessToken = await generateAccessToken(payload);
        const newRefreshToken = await generateRefreshToken(payload);

        res.cookie('a_token', newAccessToken, accessCookieOptions)
        res.cookie('r_token', newRefreshToken, refreshCookieOptions)

        //saving new Refresh token to DB
        tokenUser.refreshToken = newRefreshToken;
        tokenUser.expiresAt = new Date(Date.now() + refreshCookieOptions.maxAge);
        tokenUser.userIP = req.ip;
        await tokenUser.save();
        

        console.log("Token Refreshed Successfully!" , tokenUser)
        return res.status(200).json({
            success : true,
            message: "Token Refreshed Successfully!",
            user: payload
        })

    } catch (err) {
        return res.status(401).json({
            message: "Either R_Token not Valid OR Internal server error Occured! Please try again.",
            error: err.message,
            err
        })
    }
}


module.exports = { rotateTokens }