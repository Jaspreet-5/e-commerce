const productModel = require('../models/product.model')
const { uploadPhoto, deletePhoto } = require('../services/uploadPic.service');
const AppError = require('../utils/appError');
const mongoose = require("mongoose");


const uploadProduct = async (req, res) => {

    const { color, colorFamily, fabric, price, size } = req.body;
    const image = req.file;

    // console.log("Body : ", req.body);
    // console.log("FIle : ", req.file)

    if (!(image && color && colorFamily && fabric && price) && size) {
        throw new AppError("Some or All Fields are missing to upload product!", 400);
    }

    let productPhoto;

    try {

        productPhoto = await uploadPhoto(image);
        await productModel.create({
            image: {
                url: productPhoto.url,
                fileId: productPhoto.fileId
            },
            color,
            colorFamily,
            fabric,
            size,
            price
        })

        return res.status(201).json({
            success: true,
            message: "Product Uploaded Successfully!"
        })

    }
    catch (err) {
        console.error("Failed to Upload ", err);
        try {
            if (productPhoto?.fileId) {
                await deletePhoto(productPhoto.fileId);
            }
        }
        catch (cleanUp_Error) {
            console.error("CleanUp failed ", productPhoto.fileId, cleanUp_Error);
        }

        throw new AppError("Failed to Upload!! Please try again.", 500);
    }
};


const deleteProduct = async (req, res) => {

    try {
        const id = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new AppError("Invalid Product ID!", 400);
        }

        const product = await productModel.findById(id);

        if (!product) {
            throw new AppError("Product not found!", 404);
        }

        await Promise.all([
            deletePhoto(product.image.fileId),
            product.deleteOne()
        ]);

        return res.status(200).json({
            success: true,
            message: "Product deleted successfully!"
        });

    } catch (err) {
        console.error("Delete product failed:", err.message);
        throw err;
    }
};


const getProducts = async (req, res) => {

    let {
        page = 1,
        limit = 10,
        search,
        colorFamily,
        fabric,
        size,
        minPrice,
        maxPrice,
        sort
    } = req.query;

    page = Math.max(1, Number(page) || 1);
    limit = Math.min(
        Math.max(1, Number(limit) || 10),
        20)
    const skip = (page - 1) * limit;


    const filter = {};

    if (colorFamily) filter.colorFamily = colorFamily;
    if (fabric) filter.fabric = fabric;
    if (size) filter.size = size;

    if (minPrice || maxPrice) {
        filter.price = {};

        if (minPrice) filter.price.$gte = Number(minPrice);
        if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if(search?.trim()){

        const regex = new RegExp(search.trim() , 'i');

        filter.$or = [
            {color: regex,},
            {colorFamily: regex},
            {fabric: regex}
        ]
    }

    let sortOption = { createdAt: -1 };

    switch (sort) {

        case "price_asc":
            sortOption = { price: 1 };
            break;

        case "price_desc":
            sortOption = { price: -1 };
            break;
            
        default:
            sortOption = { createdAt: -1 };
    }


    const products = await productModel.find(filter)
        .sort(sortOption)
        .select({
            "image.url": 1,
            "image.fileId": 1,
            color: 1,
            price: 1,
            fabric: 1,
            size: 1,
            _id: 1
        })
        .skip(skip)
        .limit(limit)
        .lean();

    if (!products) {
        throw new AppError("No Products Found!", 404)
    }

    return res.status(200).json({
        success: true,
        page,
        limit,
        count: products.length,
        products
    });

};


const getIndividualProduct = async (req, res) => {

    const productId = req.params.productId;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
        throw new AppError("Invalid productId!", 400);
    }

    const product = await productModel.findById(productId)
        .select({
            "image.url": 1,
            color: 1,
            colorFamily: 1,
            fabric: 1,
            size: 1,
            price: 1
        })
        .lean();

    if (!product) {
        throw new AppError("Product not Found!", 404)
    }

    return res.status(200).json({
        success: true,
        product
    })
};


const updateProduct = async (req, res) => {

    const productId = req.params.productId;
    const { color, colorFamily, fabric, price, size } = req.body;
    const file = req.file;

    if (
        color === undefined &&
        colorFamily === undefined &&
        fabric === undefined &&
        price === undefined &&
        size === undefined &&
        !file
    ) {
        throw new AppError("At least one field is required!", 400);
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
        throw new AppError("Product Id not valid!", 400);
    }

    const product = await productModel.findById(productId)
        .select("image.fileId");

    if (!product) {
        throw new AppError("Product not Found!", 404);
    }

    const oldImageFileId = product.image.fileId;

    const updatedData = {};

    if (color !== undefined) {
        updatedData.color = color;
    }
    if (colorFamily !== undefined) {
        updatedData.colorFamily = colorFamily;
    }
    if (fabric !== undefined) {
        updatedData.fabric = fabric;
    }
    if (size !== undefined) {
        updatedData.size = size;
    }
    if (price !== undefined) {
        updatedData.price = Number(price);
    }

    let updatedFile;

    try {

        if (file) {

            updatedFile = await uploadPhoto(file);
            updatedData.image = {
                url: updatedFile.url,
                fileId: updatedFile.fileId
            }
        }

        if (updatedData) {

            const updatedProduct = await productModel.findByIdAndUpdate(
                productId,
                { $set: updatedData },
                {
                    new: true,
                    runValidators: true
                }
            )

            if (!updatedProduct) {
                throw new AppError("Product not found!", 404);
            }
        }

    }
    catch (err) {
        if (updatedFile) {
            await deletePhoto(updatedFile.fileId);
        }
        console.log("Product Updation Failed", err.message, err);

        throw err;
    }

    if (updatedFile) {

        try {
            await deletePhoto(oldImageFileId);
        }
        catch (err) {
            console.log(
                "Removing old photo failed!",
                oldImageFileId,
                err
            );
        }

    }
    return res.sendStatus(204);

};


module.exports = { uploadProduct, deleteProduct, getProducts, getIndividualProduct, updateProduct };

