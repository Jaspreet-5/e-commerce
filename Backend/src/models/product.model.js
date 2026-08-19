const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({

    image: {

        url: {
            type: String,
            required: [true, "Image URL is required"]
        },

        fileId: {
            type: String,
            required: [true, "Image file ID is required"]
        }
    },

    color: {
        type: String,
        required: [true, "Color is required"],
        trim: true
    },

    colorFamily: {
        type: String,
        required: true,
        trim: true,
        index : true
    },

    fabric: {
        type: String,
        trim: true,
        enum: ["Full-Voil", "Rubia", "Mix"],
        required: [true, "Type of Fabric is required to fill!"],
        index : true
    },

    size : {
        type : Number,
        enum : [5 , 6 , 7 , 5.5 , 6.5 , 7.5],
        required : true
    },

    price: {
        type: Number,
        min: [0, "Price cannot be negative!"],
        required: [true, "Price is required"],
        index : true
    }

}, { timestamps: true })

productSchema.index({createdAt : -1});

const productModel = mongoose.model("product", productSchema);

module.exports = productModel;