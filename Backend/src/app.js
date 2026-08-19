const express = require('express');
const cookieParser = require('cookie-parser')
const productRoutes = require('./routes/product.route')
const authRoutes = require('./routes/auth.route')
const tokenRoutes = require('./routes/token.route')
const errorHandler = require('./middlewares/error.middleware');
const cartRoutes = require('./routes/cart.route')
const orderRoutes = require('./routes/order.route')
const cors = require('cors');
const app = express();



app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));
app.use(express.json())
app.use(cookieParser())

app.use('/api/services' , productRoutes) // all product routes

app.use('/api/auth/t' , tokenRoutes) //to rotate tokens , [ t ] stands for token

app.use('/api/auth' , authRoutes) //user login , signup routes

app.use('/api/cart' , cartRoutes) //routes related to cart;

app.use('/api/order' , orderRoutes); 

//global/centralized error handler:
app.use(errorHandler);

module.exports = app;