const errorHandler = (err , req , res , next) => {
    const statusCode = err.statusCode || 500;
    console.log(err.message , err);

    return res.status(statusCode).json({
        success : false,
        message : statusCode === 500? "Internal Server Error" : err.message
    })
}

module.exports = errorHandler;