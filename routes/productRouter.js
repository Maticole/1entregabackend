const express = require('express');
const productController = require('../controllers/productController');
const productRouter = express.Router();

productRouter.get('/', productController.getProducts);
productRouter.post('/', productController.addProduct);
productRouter.get('/:id', productController.getProductById);
productRouter.put('/:id', productController.updateProduct);
productRouter.delete('/:id', productController.deleteProduct);

module.exports = productRouter;