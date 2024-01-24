const express = require('express');
const productManager = require('../models/ProductManager');
const productRouter = express.Router();

productRouter.get('/', (req, res) => {
  const products = productManager.getAllProducts();
  res.render('index', { products });
});

productRouter.get('/:pid', (req, res) => {
  const productId = parseInt(req.params.pid);
  const product = productManager.getProductById(productId);

  if (product) {
    res.render('productDetail', { product });
  } else {
    res.status(404).json({ message: 'Producto no encontrado' });
  }
});

productRouter.post('/', (req, res) => {
  const productData = req.body;
  productManager.addProduct(productData);
  io.emit('actualizarProductos', productData);
  res.status(201).json({ message: 'Producto creado exitosamente' });
});

productRouter.put('/:pid', (req, res) => {
  const productId = parseInt(req.params.pid);
  const updatedFields = req.body;
  productManager.updateProduct(productId, updatedFields);
  io.emit('actualizarProductos', { id: productId, ...updatedFields });
  res.json({ message: 'Producto actualizado exitosamente' });
});

productRouter.delete('/:pid', (req, res) => {
  const productId = parseInt(req.params.pid);
  productManager.deleteProduct(productId);
  io.emit('eliminarProducto', { id: productId });
  res.json({ message: 'Producto eliminado exitosamente' });
});

module.exports = productRouter;