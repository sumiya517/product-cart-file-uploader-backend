

/*
Cart {
    userId: 'user id' => req.user,
    products: [{
        product: 'product id',
        quantity: 1
    }]
}
*/

const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'Product',
            },
            quantity: {
                type: Number,
                required: true,
            },
        },
    ],
});

cartSchema.methods.addToCart = async function (prodId) {
    try {
        const productIndex = this.products.findIndex(
            (prod) => prod.product.toString() === prodId.toString()
        );
        if (productIndex >= 0) {
            this.products[productIndex].quantity++;
        } else {
            this.products.push({
                product: prodId,
                quantity: 1,
            });
        }
        await this.save();
    } catch (error) {
        throw new Error(error);
    }
};

cartSchema.methods.removeFromCart = async function (prodId) {
    try {
        this.products = this.products.filter(
            (prod) => prod.product.toString() !== prodId.toString()
        );
        await this.save();
    } catch (error) {
        throw new Error(error);
    }
};

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;

// const { getDb } = require('../config/database');
// const mongodb = require('mongodb');

// class Cart {
//     constructor(userId, products = []) {
//         this.userId = mongodb.ObjectId(userId);
//         this.products = products;
//     }

//     async save() {
//         try {
//             const db = getDb();
//             await db.collection('carts').insertOne(this);
//         } catch (error) {
//             throw new Error(error);
//         }
//     }

//     static async addToCart(userId, prodId) {
//         try {
//             const db = getDb();
//             const cart = await db
//                 .collection('carts')
//                 .findOne({ userId: mongodb.ObjectId(userId) });
//             const currentProducts = cart.products;
//             const productIndex = currentProducts.findIndex(
//                 (prod) => prod.product.toString() === prodId.toString()
//             );
//             if (productIndex >= 0) {
//                 currentProducts[productIndex].quantity++;
//             } else {
//                 currentProducts.push({
//                     product: mongodb.ObjectId(prodId),
//                     quantity: 1,
//                 });
//             }
//             await db
//                 .collection('carts')
//                 .updateOne(
//                     { userId: mongodb.ObjectId(userId) },
//                     { $set: { products: currentProducts } }
//                 );
//         } catch (error) {
//             throw new Error(error);
//         }
//     }

//     static async findCartByUser(userId) {
//         try {
//             const db = getDb();
//             const cart = db
//                 .collection('carts')
//                 .findOne({ userId: mongodb.ObjectId(userId) });
//             return cart;
//         } catch (error) {
//             throw new Error(error);
//         }
//     }

//     static async removeFromCart(userId, prodId) {
//         try {
//             const db = getDb();
//             const cart = await db
//                 .collection('carts')
//                 .findOne({ userId: mongodb.ObjectId(userId) });
//             const currentProducts = cart.products.filter(
//                 (prod) => prod.product.toString() !== prodId.toString()
//             );

//             await db
//                 .collection('carts')
//                 .updateOne(
//                     { userId: mongodb.ObjectId(userId) },
//                     { $set: { products: currentProducts } }
//                 );
//         } catch (error) {
//             throw new Error(error);
//         }
//     }

//     static async getCart(userId) {
//         try {
//             const db = getDb();
//             const cart = await db
//                 .collection('carts')
//                 .findOne({ userId: mongodb.ObjectId(userId) });

//             let products = [];

//             for (let i = 0; i < cart.products.length; i++){
//                 const product = await db.collection('products').findOne({ _id: cart.products[i].product } );
//                 products.push({
//                     _id: product._id,
//                     title: product.title,
//                     price: product.price,
//                     quantity: cart.products[i].quantity
//                 });
//             }
//             return products;
//         } catch (error) {
//             throw new Error(error);
//         }
//     }
// }

// module.exports = Cart;