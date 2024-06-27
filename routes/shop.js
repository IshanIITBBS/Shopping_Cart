const path = require('path');
const logincheck = require('../middleware/logincheck').logincheck ;
const express = require('express');

const shopController = require('../controllers/shop');

const router = express.Router();

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

// // // If we have below route after /products then we have place this specific route before any dynamic route in /products , otherwise it will execute dynamic route since /:productId can be any thing 
// // // router.get('/products/delete') ;
 router.get('/products/:productId',shopController.getProduct) ;

router.get('/cart',logincheck, shopController.getCart);
router.post('/cart',logincheck, shopController.postcart);

router.get('/orders',logincheck, shopController.getOrders);
router.post('/create-order',logincheck, shopController.getPostOrder) ;

// // router.get('/checkout', shopController.getCheckout);
router.post('/delete-product',logincheck,shopController.deleteCartproduct) ;
router.get('/loginreq',shopController.getloginreq) ;

module.exports = router;
