const express = require('express');
const shopController = require('../controllers/shop');
const validator = require('../middlewareValidation/validator');

const router = express.Router();


router.get('/', shopController.getHome);

router.get('/products/:productId', shopController.getProduct);

router.get('/cart', shopController.getCart);

router.post('/cart', validator.cart, shopController.postCart);

router.delete('/remove-product-cart', validator.cart, shopController.postCartDeleteProduct);

module.exports = router;