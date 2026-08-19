const { adminSignup, adminLogin, userSignUp, userLogin , userDetails, userLogout, getFullUserDetails, updateAddress} = require('../controllers/auth.controller')
const { authorize } = require('../middlewares/auth.middleware')

const router = require('express').Router()



/**
 * @POST /api/auth/admin/signup
 * signup for admin only
 */
router.post('/admin/signup' , adminSignup)

/**
 * @POST /api/auth/admin/login
 * login for admin only
 */
router.post('/admin/login' , adminLogin)

/**
 * @POST /api/auth/signup
 * signup for users
 */
router.post('/signup' , userSignUp)

/**
 * @POST /api/auth/login
 * login for users
 */
router.post('/login' , userLogin)




router.use(authorize());

/**
 * @POST /api/auth/me
 * return logged in user details
 */
router.get('/me' , userDetails)

/**
 * @POST /api/auth/logout
 * logout user 
 */
router.post('/logout' , userLogout);


/**
 * @GET /api/auth/user/details
 * it return every detail of the user , which may use for cart Checkout
 */
router.get('/user/details' , getFullUserDetails);

/**
 * @PATCH /api/auth/user/updateAdress
 * fills out the address in userModel
 */
router.patch('/user/updateAddress' , updateAddress);



module.exports = router;