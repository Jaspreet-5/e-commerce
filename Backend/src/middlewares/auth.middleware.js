const AppError = require("../utils/appError");
const { verifyTokens } = require("../utils/token");

const authorize = (role) => {

    return async (req, res, next) => {

        const accessToken = req.cookies.a_token;

        if (!accessToken) {
            throw new AppError("Middleware: Token not Found! Please Signup or Login" , 401);
        }

        try {

            const decoded = await verifyTokens(accessToken);
            
            req.user = decoded;
            
        } catch (err) {
            
            console.log(
                "Middleware error! : ",
                err.message,
                err.name
            );
            
            if (err.name === "TokenExpiredError") {
                return res.status(401).json({
                    message: "Access token expired"
                });
            }

            if (err.name === "JsonWebTokenError") {
                return res.status(401).json({
                    message: "Invalid token"
                });
            }
            
            throw err;
        }

        // role authorization
        if (role && req.user.role !== role) {
            throw new AppError("You don't have enough privileges!" , 403);
        }
        
        return next();
    };
};

module.exports = {authorize}