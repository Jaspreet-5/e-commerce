const { ObjectId } = require("mongodb");
const cartModel = require("../models/cart.model");
const productModel = require('../models/product.model');
const AppError = require("../utils/appError");
const mongoose = require('mongoose');


const addProductToCart = async (req, res) => {

  const userId = req.user.id;
  const { productId, quantity } = req.body;

  if (!userId) {
    throw new AppError("User not Authenticated!", 401);
  }

  if (!(mongoose.Types.ObjectId.isValid(productId) && (Number.isFinite(quantity) && quantity > 0))) {
    throw new AppError("Product is not valid!", 400);
  }

  const product = await productModel.findById(productId);

  if (!product) {
    throw new AppError("Product doesn't Exists!", 404);
  }

  let cart = await cartModel.findOne({
    userId
  });

  if (cart) {

    const productIndex = cart.products.findIndex(prod =>
      prod.productId.equals(productId)
    );

    if (productIndex !== -1) {
      cart.products[productIndex].quantity += quantity;
    }
    else {
      cart.products.push({ productId, quantity });
    }

    await cart.save();
  }
  else {
    cart = await cartModel.create({
      userId,
      products: { productId, quantity }
    })
  }

  return res.status(200).json({
    success: true,
    message: "Product added to cart!"
  })
}


const getCart = async (req, res) => {

  const decodedUserId = req.user.id;

  const cartProducts = await cartModel.aggregate(
    [
      {
        $match: { userId: new mongoose.Types.ObjectId(decodedUserId) }
      },

      {
        $unwind: "$products"
      },

      {
        $lookup: {
          from: "products",
          localField: "products.productId",
          foreignField: "_id",
          as: "cartProd"
        }
      },

      {
        $unwind: "$cartProd"
      },

      {
        $project: {
          _id: 0, // 0 means , it will not send the Id
          productId: "$products.productId",
          quantity: "$products.quantity",
          imageUrl: "$cartProd.image.url",
          color: "$cartProd.color",
          price: "$cartProd.price",
          fabric: "$cartProd.fabric",
          size: "$cartProd.size",
          subTotal: { $multiply: ["$products.quantity", "$cartProd.price"] }
        }
      }
    ]
  )


  if (cartProducts.length === 0) {
    throw new AppError("Cart is empty!", 404);
  }

  return res.status(200).json({
    success: true,
    cartProducts
  })
}


const deleteCartProduct = async (req, res) => {

  const {productId} = req.body;
  const userId = req.user.id;

  if (!productId) {
    throw new AppError("Product Id not found!", 400);
  }

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new AppError("Product Id is invalid!", 400);
  }

  const cart = await cartModel.findOne({
    userId
  });

  if (!cart) {
    throw new AppError("Product not Found!", 404);
  }

  const productIndex = cart.products.findIndex(cartItem => cartItem.productId.equals(productId));

  if (productIndex === -1) {
    throw new AppError("Product not Found!", 404);
  }

  cart.products.splice(productIndex, 1);
  await cart.save();

  return res.sendStatus(204);

}


const clearCart = async (req, res) => {
  const userId = req.user.id;

  //to keep document/user details in DB and clear products only: 
  const cart = await cartModel.findOneAndUpdate({
    userId
  },
    {
      $set: {
        products: []
      }
    })

  return res.sendStatus(204);
}


const productQuantityChange = async (req, res) => {

  const { productId, newQuantity } = req.body;

  if (!productId || newQuantity == null) {
    throw new AppError(
      "Product id or quantity is missing",
      400
    );
  }

  if (!Number.isInteger(newQuantity) || newQuantity < 1) {
    throw new AppError(
      "Quantity must be a positive integer",
      400
    );
  }

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new AppError("Proudct Id is not valid!", 400);
  }

  const updatedProduct = await cartModel.findOneAndUpdate(
    {
      userId: req.user.id,
      "products.productId": productId
    },
    {
      $set: {
        "products.$.quantity": newQuantity
      }
    },
    {
      new: true
    }
  )

  if (!updatedProduct) {
    throw new AppError("Product not Found and failed to update quantity", 404)
  }

  res.sendStatus(204);

}

module.exports = { addProductToCart, getCart, deleteCartProduct, clearCart, productQuantityChange }; 