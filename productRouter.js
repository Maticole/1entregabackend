const express = require('express');
const router = express.Router();
const productManager = require('./ProductManager'); 

router.get('/', (req, res) => {
  res.json({ products: productManager.getAllProducts() });
});

router.get('/:pid', (req, res) => {
  const productId = parseInt(req.params.pid);
  const product = productManager.getProductById(productId);

  if (product) {
    res.json({ product });
  } else {
    res.status(404).json({ message: 'Producto no encontrado' });
  }
});

module.exports = router;