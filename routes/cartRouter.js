const express = require('express');
const CartManager = require('../dao/CartManager');
const cartRouter = express.Router();

const cartManager = new CartManager();

let io;

function emitCartUpdate(cart) {
  io.emit('actualizarCarrito', cart);
}

cartRouter.use((req, res, next) => {
  io = req.app.get('io');
  next();
});

cartRouter.post('/', async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    emitCartUpdate(newCart);
    res.json(newCart);
  } catch (error) {
    console.error("Error al crear el carrito:", error.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

cartRouter.get('/:cid', async (req, res) => {
  const cartId = req.params.cid;
  try {
    const cart = await cartManager.getCartById(cartId);
    if (cart) {
      res.json(cart);
    } else {
      res.status(404).json({ message: 'Carrito no encontrado' });
    }
  } catch (error) {
    console.error("Error al obtener el carrito:", error.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});


module.exports = cartRouter;