const path = require('path');

const express = require('express');

const adminController = require('../controllers/admin');

const logincheck = require('../middleware/logincheck').logincheck ;

const router = express.Router();

// /admin/add-product => GET
router.get('/add-product',logincheck, adminController.getAddProduct);

// /admin/products => GET
router.get('/products',logincheck, adminController.getProducts);

 // /admin/add-product => POST
router.post('/add-product', logincheck,adminController.postAddProduct);

router.get('/edit-product/:productId',logincheck,adminController.editproduct)
router.post('/edit-product',logincheck,adminController.posteditProduct)

router.post('/delete-product',logincheck,adminController.deleteproduct) ;

module.exports = router;
