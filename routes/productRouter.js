const express = require('express');
const productManager = require('../dao/ProductManager');
const productRouter = express.Router();

productRouter.post('/', async (req, res) => {
  const productData = req.body;
  try {
    await productManager.addProduct(productData);
    io.emit('actualizarProductos', await productManager.getAllProducts());
    res.status(201).json({ message: 'Producto creado exitosamente' });
  } catch (error) {
    console.error("Error al crear el producto:", error.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = productRouter;