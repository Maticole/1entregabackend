const express = require('express');
const ProductManager = require('./ProductManager'); 
const app = express();
const productManager = new ProductManager('./productos.json');
const productRouter = require('./productRouter'); 
const cartRouter = require('./uploadFile');


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

// const app = express();
const PORT = 8080;
app.use(express.json());


app.use('/api/products', productRouter);


app.use('/api/carts', cartRouter);
app.listen(PORT, () => {
  console.log(`Servidor Express iniciado en el puerto ${PORT}`);
});




