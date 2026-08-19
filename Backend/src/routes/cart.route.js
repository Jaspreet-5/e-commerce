const { getCart, addProductToCart, deleteCartProduct, clearCart, productQuantityChange } = require('../controllers/cart.controller');
const { authorize } = require('../middlewares/auth.middleware');

const router = require('express').Router();

router.use(authorize()); //to authenticate the user

/**
 * @GET /api/cart/
 * to get all products present in the cart
 */
router.get('/' , getCart);


/**
 * @POST /api/cart/addProductToCart
 * to add product in the cart 
 */
router.post('/addProductToCart' , addProductToCart);


/**
 * @DELETE /api/cart/removeProduct
 * to delete a product from the cart;
 */
router.delete('/removeProduct' , deleteCartProduct);


/**
 * @POST /api/cart/clearCart
 * to clear the cart , #it deletes all products present in the cart
 */
router.post('/clearCart' , clearCart);


/**
 * @PATCH /api/cart/updateProductQuantity
 * it is updating the quantity of product , which is manipulated by user 
 */
router.patch('/updateProductQuantity' , productQuantityChange);



module.exports = router;