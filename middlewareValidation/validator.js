const { body } = require('express-validator');

const validator = {
    createProduct: [
        body('title')
            .notEmpty()
            .withMessage('Title is required')
            .isString()
            .withMessage('Title must be string!'),
        body('price')
            .notEmpty()
            .withMessage('Price is required')
            .isNumeric()
            .withMessage('Price must be number'),
        body('description')
            .notEmpty()
            .withMessage('Description is required')
            .isString()
            .withMessage('Description must be string'),
        body('stock')
            .notEmpty()
            .withMessage('stock is required')
            .isNumeric()
            .withMessage('stock must be number'),

    ],
    updateProduct: [
        body('title').isString().withMessage('Title must be string!'),
        body('price').isNumeric().withMessage('Price must be number'),
        body('description').isString().withMessage('Description must me string'),
        body('stock').isNumeric().withMessage('stock must me number'),
    ],
    cart: body('productId')
        .notEmpty()
        .withMessage('Product id is required')
        .isString()
        .withMessage('Product id must be string!'),
};

module.exports = validator;