const express = require('express');
const ProductManager = require('./ProductManager'); 
const app = express();
const productManager = new ProductManager('productos.json'); 


app.get('/products', (req, res) => {
  let products = productManager.getProducts();

  
  const limit = parseInt(req.query.limit);
  if (!isNaN(limit)) {
    products = products.slice(0, limit);
  }

  res.json({ products });
});


app.get('/products/:pid', (req, res) => {
  const productId = parseInt(req.params.pid);
  const product = productManager.getProductById(productId);

  if (product) {
    res.json({ product });
  } else {
    res.status(404).json({ message: 'Producto no encontrado' });
  }
});


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor Express iniciado en el puerto ${PORT}`);
});