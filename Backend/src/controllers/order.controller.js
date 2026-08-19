const mongoose = require('mongoose');
const AppError = require('../utils/appError');
const cartModel = require('../models/cart.model');
const productModel = require('../models/product.model');
const orderModel = require('../models/orders.model');

const productCheckout = async (req, res) => {

    const userId = req.user.id;
    const { orderType } = req.body; //orderType is to check wheather user order product from cart or direct click on order from individual product

    if (!orderType) {
        throw new AppError("Order Type Required!", 400)
    }

    const productCheckoutDetails = [];
    let totalPrice = 0;

    switch (orderType) {

        case "cart": {

            const cartProduct = await cartModel.findOne({
                userId
            });

            if (!cartProduct) {
                throw new AppError("Invalid User!", 401);
            }

            const productIds = cartProduct.products.map((product) => product.productId);

            const products = await productModel.find({
                _id: {
                    $in: productIds
                }
            })

            const productMap = new Map(
                products.map(product =>
                    [
                        product._id.toString(), product
                    ]
                )
            )

            // let totalPrice = 0;
            for (const item of cartProduct.products) {

                const product = productMap.get(item.productId.toString());

                if (!product) {
                    throw new AppError("Product no longer exists!", 404);
                }

                totalPrice += item.quantity * product.price

            }
            productCheckoutDetails.push({
                amount: totalPrice
            })

            break;
        }

        case "buyNow": {

            const { productId, quantity } = req.body;

            if (!quantity || quantity < 1) {
                throw new AppError("Invalid quantity", 400)
            }

            if (!mongoose.Types.ObjectId.isValid(productId)) {
                throw new AppError("Invalid product!", 400);
            }

            const product = await productModel.findById(productId)

            if (!product) {
                throw new AppError("Product not found!", 404);
            }

            totalPrice = product.price * quantity;

            productCheckoutDetails.push({
                amount: totalPrice,
            });

            break;

        }

        default: {
            throw new AppError("Invalid orderType!", 400);
        }
    }

    return res.status(200).json({
        success: true,
        totalPrice,
        productCheckoutDetails
    });

}


const placeOrder = async (req, res) => {

    const { orderDetails } = req.body;

    console.log(orderDetails)

    if (!orderDetails) {
        throw new AppError("Order Details not found!", 400);
    }

    if (!mongoose.Types.ObjectId.isValid(orderDetails.userId)) {
        throw new AppError("Invalid Order Details!", 400);
    }

    orderDetails.items.forEach((product) => {
        if (!mongoose.Types.ObjectId.isValid(product.productId)) {
            throw new AppError("Products are not valid!", 400);
        }
    })

    
    const order = orderModel.create(orderDetails);
    
    return res.status(201).json({
        success: true,
        message: "Order placed Successfully!"
    })

    // switch (orderDetails?.paymentMethod) {

    //     case "COD": {
            

    //         break;
    //     }

    //     case "UPI": {


    //         break;
    //     }

    //     case "PAYMENT_GATEWAY": {


    //         break;
    //     }

    //     default: {
    //         throw new AppError("Inappropriate Payment Method!", 400)
    //     }

    // }


}

module.exports = { productCheckout, placeOrder };