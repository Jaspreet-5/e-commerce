const jwt = require('jsonwebtoken')

const generateAccessToken = async (payload) => {

    return jwt.sign(
        payload, 
        process.env.JWT_SECRET, 
        { expiresIn : "15m" }
    ) 
}

const generateRefreshToken = async (payload) =>{
    
    return jwt.sign(
        payload, 
        process.env.JWT_SECRET,
        { expiresIn : "7d" }
    )
}

const verifyTokens = (token) => {
    return jwt.verify(token , process.env.JWT_SECRET)
}

module.exports = {generateAccessToken , generateRefreshToken , verifyTokens};