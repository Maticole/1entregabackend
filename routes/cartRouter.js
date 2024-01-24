const express = require('express');
const CartManager = require('../models/cartManager');
const uploadToServer = require('../utils/uploadFile');
const cartRouter = express.Router();

const cartFilePath = '../data/carrito.json';
const cartManager = new CartManager(cartFilePath);

let io;

function emitCartUpdate(cart) {
  io.emit('actualizarCarrito', cart);
}

cartRouter.use((req, res, next) => {
  io = req.app.get('io');
  next();
});

cartRouter.post('/', (req, res) => {
  const newCart = cartManager.createCart();
  
    emitCartUpdate(newCart);

  res.json(newCart);
});

cartRouter.get('/:cid', (req, res) => {
  const cartId = parseInt(req.params.cid);
  const cart = cartManager.getCartById(cartId);

  if (cart) {
    res.json(cart);
  } else {
    res.status(404).json({ message: 'Carrito no encontrado' });
  }
});

cartRouter.post('/:cid/product/:pid', (req, res) => {
  const cartId = parseInt(req.params.cid);
  const productId = parseInt(req.params.pid);
  const quantity = parseInt(req.body.quantity) || 1;

  try {
    const cart = cartManager.getCartById(cartId);
    const product = productManager.getProductById(productId);

    if (!cart) {
      res.status(404).json({ message: 'Carrito no encontrado' });
      return;
    }

    if (!product) {
      res.status(404).json({ message: 'Producto no encontrado' });
      return;
    }

    const existingProduct = cart.products.find(item => item.id === productId);

    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      cart.products.push({ id: productId, quantity });
    }

    cartManager.saveCarts();
   
    emitCartUpdate(cart);

    res.json(cart);
  } catch (error) {
    console.error('Error al agregar producto al carrito:', error);
    res.status(500).json({ error: 'Error al agregar producto al carrito' });
  }
});

module.exports = cartRouter;