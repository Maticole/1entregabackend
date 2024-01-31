const express = require('express');
const productManager = require('../models/ProductManager');
const productRouter = express.Router();

productRouter.post('/', (req, res) => {
  const productData = req.body;
  productManager.addProduct(productData);

 
  io.emit('actualizarProductos', productManager.getAllProducts());

  res.status(201).json({ message: 'Producto creado exitosamente' });
});



module.exports = productRouter;