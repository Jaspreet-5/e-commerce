const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true,
            index: true
        },

        items: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "product",
                    required: true
                },

                quantity: {
                    type: Number,
                    required: true,
                    min: 1
                },

                price: {
                    type: Number,
                    required: true
                },

                subtotal: {
                    type: Number,
                    required: true
                }
            }
        ],

        subtotal: {
            type: Number,
            required: true
        },

        deliveryCharge: {
            type: Number,
            default: 0
        },

        total: {
            type: Number,
            required: true
        },

        paymentMethod: {
            type: String,
            enum: ["COD", "UPI"],
            required: true
        },

        paymentStatus: {
            type: String,
            enum: ["pending", "paid", "failed"],
            default: "pending"
        },

        orderStatus: {
            type: String,
            enum: [
                "placed",
                "processing",
                "shipped",
                "delivered",
                "cancelled"
            ],
            default: "placed"
        },

        shippingAddress: {
            name: String,
            phoneNo: String,
            email: String,
            area: String,
            pincode: String,
            city: String,
            state: String,
            country: String
        }
    },
    { timestamps: true }
);

const orderModel = mongoose.model("orders", orderSchema);

module.exports = orderModel;