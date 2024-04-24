const express = require('express');
const productController = require('../controllers/productController');
const authController = require('../controllers/authController');
const productRouter = express.Router();
const mockingModule = require('../utils/mockingModule');
const { errorHandler, errorDictionary } = require('../utils/errorHandler');

productRouter.get('/mockingproducts', (req, res, next) => {
    const mockedProducts = mockingModule.generateMockedProducts();
    res.json(mockedProducts);
  });            

  productRouter.get('/', errorHandler(productController.getProducts));
  productRouter.post('/', authController.authorizeUser, errorHandler(productController.addProduct));
  productRouter.get('/:id', errorHandler(productController.getProductById));
  productRouter.put('/:id', authController.authorizeUser, errorHandler(productController.updateProduct));
  productRouter.delete('/:id', authController.authorizeUser, errorHandler(productController.deleteProduct));


module.exports = productRouter;