const express = require('express');
const cartController = require('../controllers/cartController');
const authController = require('../controllers/authController');
const cartRouter = express.Router();

cartRouter.delete('/:cid/products/:pid', cartController.removeProductFromCart);
cartRouter.put('/:cid', cartController.updateCart);
cartRouter.put('/:cid/products/:pid', cartController.updateProductQuantity);
cartRouter.delete('/:cid', cartController.clearCart);
cartRouter.post('/:cid/purchase', authController.authorizeUser, cartController.purchaseCart);

module.exports = cartRouter;