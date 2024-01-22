const express = require('express');
const ProductManager = require('../models/ProductManager');
const uploadToServer = require('../uploadFile');

const cartRouter = express.Router();
const cartFilePath = ('./data/carrito.json'); 
const productManager = new ProductManager('./data/productos.json');

cartRouter.post('/', (req, res) => {
   
  const newCartId = Math.floor(Math.random() * 1000); 
  const newCart = {
    id: newCartId,
    products: []
  };

try {
    const carts = uploadToServer(cartFilePath);
    carts.push(newCart);
    fs.writeFileSync(cartFilePath, JSON.stringify(carts, null, 2), 'utf8');
    res.json(newCart);
  } catch (error) {
    console.error('Error al crear el carrito:', error);
    res.status(500).json({ error: 'Error al crear el carrito' });
  }
  
});

cartRouter.get('/:cid', (req, res) => {
    const cartId = parseInt(req.params.cid);

  try {
    const carts = uploadToServer(cartFilePath);
    const cart = carts.find(cart => cart.id === cartId);

    if (cart) {
      res.json(cart);
    } else {
      res.status(404).json({ message: 'Carrito no encontrado' });
    }
  } catch (error) {
    console.error('Error al obtener el carrito:', error);
    res.status(500).json({ error: 'Error al obtener el carrito' });
  }
 
});

cartRouter.post('/:cid/product/:pid', (req, res) => {
    const cartId = parseInt(req.params.cid);
  const productId = parseInt(req.params.pid);
  const quantity = parseInt(req.body.quantity) || 1; S

  try {
    const carts = uploadToServer(cartFilePath);
    const cartIndex = carts.findIndex(cart => cart.id === cartId);

    if (cartIndex !== -1) {
      const cart = carts[cartIndex];
      const product = productManager.getProductById(productId);

      if (product) {
        const existingProduct = cart.products.find(item => item.id === productId);

        if (existingProduct) {
          existingProduct.quantity += quantity;
        } else {
          cart.products.push({ id: productId, quantity });
        }

        fs.writeFileSync(cartFilePath, JSON.stringify(carts, null, 2), 'utf8');
        res.json(cart);
      } else {
        res.status(404).json({ message: 'Producto no encontrado' });
      }
    } else {
      res.status(404).json({ message: 'Carrito no encontrado' });
    }
  } catch (error) {
    console.error('Error al agregar producto al carrito:', error);
    res.status(500).json({ error: 'Error al agregar producto al carrito' });
  }
 
});

module.exports = cartRouter;





