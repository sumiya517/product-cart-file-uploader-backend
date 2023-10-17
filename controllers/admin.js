const Product = require('../models/product');
const { success, failure } = require('../utils/commonResponse');
const HTTP_STATUS = require('../utils/httpStatus');
const { validationResult } = require('express-validator');
const fs = require('fs/promises');
const path = require('path');

class AdminController {
    async postProduct(req, res, next) {
        try {
            console.log('hi');
            const errors = validationResult(req);
            if (!req.file) {
                errors.errors.push({ param: 'productImage', msg: 'Product Image is required. Only jpeg, jpg and png file is allowed!' });
            }

            if (!errors.isEmpty()) {
                if(req.file){
                    await fs.unlink(path.join(__dirname, '..', 'images',req.file.filename));
                }

                return res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).send(failure('Invalid Inputs', errors.array()));
            }
            console.log("image", req.file);

            const title = req.body.title;
            const price = req.body.price;
            const description = req.body.description;
            // const imageUrl = req.file.path.replace(/\\/g,'/');
            const imageUrl = 'images/' + req.file.filename;
            const stock = req.body.stock;
            const product = new Product({ title, price, description, imageUrl, stock });
            await product.save();
            return res
                .status(HTTP_STATUS.OK)
                .send(success('Product is created successfully', product));
        } catch (error) {
            next(error);
        }
    }

    async postEditProduct(req, res, next) {
        try {
            const errors = validationResult(req);

            const prodId = req.params.productId;

            const updatedProduct = await Product.findById(prodId);

            if (!errors.isEmpty()) {
                // delete the uploaded image if any validation error occurs
                if(req.file){
                    await fs.unlink(path.join(__dirname, '..','images', req.file.filename));
                }
                //await fs.unlink(path.join(__dirname, '..', updatedProduct.imageUrl));
                return res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).send(failure('Invalid Inputs', errors.array()));
            }



            if (updatedProduct) {
                updatedProduct.title = req.body.title ? req.body.title : updatedProduct.title;
                updatedProduct.price = req.body.price ? req.body.price : updatedProduct.price;
                updatedProduct.description = req.body.description ? req.body.description : updatedProduct.description;
                // updatedProduct.imageUrl = req.body.imageUrl? req.body.imageUrl: updatedProduct.imageUrl;
                updatedProduct.stock = req.body.stock ? req.body.stock : updatedProduct.stock;
                // if (req.body.title) {
                //     updatedProduct.title = req.body.title;
                // }
                // if (req.body.price) {
                //     updatedProduct.price = req.body.price;
                // }
                // if (req.body.description) {
                //     updatedProduct.description = req.body.description;
                // }
                if (req.file) {
                    await fs.unlink(path.join(__dirname, '..', updatedProduct.imageUrl));
                    updatedProduct.imageUrl = 'images/' + req.file.filename;
                }
                // if (req.body.stock) {
                //     updatedProduct.stock = req.body.stock;
                // }
                await updatedProduct.save();
                return res
                    .status(HTTP_STATUS.OK)
                    .send(
                        success('Product is updated successfully', updatedProduct)
                    );
            }
            return res
                .status(HTTP_STATUS.NOT_FOUND)
                .send(
                    failure('Product is not found to update')
                );
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    async deleteProduct(req, res, next) {
        try {
            const prodId = req.params.productId;
            await Product.findByIdAndDelete(prodId).exec();
            return res
                .status(HTTP_STATUS.OK)
                .send(success('Product is deleted successfully'));
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new AdminController();
