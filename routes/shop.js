const path = require('path');

const express = require('express');

const shopController = require('../controllers/shop');

const router = express.Router();

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

// // If we have below route after /products then we have place this specific route before any dynamic route in /products , otherwise it will execute dynamic route since /:productId can be any thing 
// // router.get('/products/delete') ;
 router.get('/products/:productId',shopController.getProduct) ;

router.get('/cart', shopController.getCart);
router.post('/cart', shopController.postcart);

router.get('/orders', shopController.getOrders);
router.post('/create-order', shopController.getPostOrder) ;

// router.get('/checkout', shopController.getCheckout);
router.post('/delete-product',shopController.deleteCartproduct) ;

module.exports = router;
