const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref : "users",
        required: true,
        unique: true
    },

    products: [
        {
            productId : {
                type : mongoose.Schema.Types.ObjectId,
                ref : "products",
                required : true
            },
            
            quantity : {
                type : Number,
                min : 1,
                default : 1
            }
        }
    ]
})

const cartModel = mongoose.model("cart" , cartSchema);

module.exports = cartModel;