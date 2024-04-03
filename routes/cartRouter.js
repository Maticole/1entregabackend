const express = require('express');
const cartController = require('../controllers/cartController');
const cartRouter = express.Router();

cartRouter.delete('/:cid/products/:pid', cartController.removeProductFromCart);
cartRouter.put('/:cid', cartController.updateCart);
cartRouter.put('/:cid/products/:pid', cartController.updateProductQuantity);
cartRouter.delete('/:cid', cartController.clearCart);

module.exports = cartRouter;