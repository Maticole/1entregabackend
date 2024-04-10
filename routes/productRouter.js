const express = require('express');
const productController = require('../controllers/productController');
const authController = require('../controllers/authController');
const productRouter = express.Router();

productRouter.get('/', productController.getProducts);
productRouter.post('/', authController.authorizeUser, productController.addProduct); 
productRouter.get('/:id', productController.getProductById);
productRouter.put('/:id', authController.authorizeUser, productController.updateProduct); 
productRouter.delete('/:id', authController.authorizeUser, productController.deleteProduct); 


module.exports = productRouter;
