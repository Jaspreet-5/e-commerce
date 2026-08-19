const router = require('express').Router()
const { uploadProduct , deleteProduct, getProducts, getIndividualProduct, updateProduct } = require('../controllers/product.controller')
const multer = require('multer')
const { authorize } = require('../middlewares/auth.middleware')

const maxImageSize = 1024 * 1024 * 10;
const upload = multer({
    storage: multer.memoryStorage(),

    limits: {
        files: 1,
        fileSize: maxImageSize
    },

    fileFilter: (req, file, cb) => {
        const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error("Unsupported File type!"));
        }
        return cb(null, true);
    }
})



//Normal User's routes : 
// router.use(authorize()); //OPTIONAL TO USE IT , WITHOUT THIS , YOU CAN SCROLL ONLY TO PRODUCTS

/**
 * GET /api/products
 * @USAGE it acts as a homepage like flipcart / amazon
 */
router.get('/products' , getProducts)

/**
 * GET /api/products/:productId
 * @USAGE to find detail of a specific product
 */
router.get('/product/:productId' , getIndividualProduct)







//Admin Routes : 
router.use(authorize("admin"))

/**
 * POST /api/services/uploadProduct
 * @USAGE  to upload product photo along with its details ,,, #only for admins
 */
router.post('/uploadProduct' , upload.single("image"), uploadProduct);


/**
 * DELETE /api/services/deleteProduct
 * @USAGE to delete products from DB and image storage service
 */
router.delete('/deleteProduct/:id' , deleteProduct);


/**
 * PATCH /api/product/updateProduct/:productId
 * @USAGE to make changes in existing product : like change in PRICE
 */
router.patch('/updateproduct/:productId' , upload.single("image") , updateProduct);


module.exports = router

