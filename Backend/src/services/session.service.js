const crypto = require('crypto')
const { generateAccessToken, generateRefreshToken } = require('../utils/token')
const tokenModel = require('../models/token.model')
const {refreshCookieOptions} = require("../utils/cookies")

module.exports =  async function createSession(account, req) {

    const sessionId = crypto.randomUUID();

    const payload = {
        sessionId: sessionId,
        role: account.role,
        id: account._id
    }

    const accessToken = await generateAccessToken(payload);
    const refreshToken = await generateRefreshToken(payload);

    await tokenModel.create({
        userId: account._id,
        sessionId,
        userIP: req.ip,
        userAgent: req.headers["user-agent"],
        refreshToken,
        expiresAt: new Date(
            Date.now() + refreshCookieOptions.maxAge
        )
    });

    return { accessToken, refreshToken };
}