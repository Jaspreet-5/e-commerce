const { productCheckout, placeOrder } = require('../controllers/order.controller');
const { authorize } = require('../middlewares/auth.middleware');

const router = require('express').Router();

router.use(authorize());

router.post('/checkout' , productCheckout); //last steps before placing the order

router.post('/place-order' , placeOrder);

module.exports = router;