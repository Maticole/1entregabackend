const ProductManager = require('./ProductManager');
const uploadToServer = require('./uploadFile');

const productManager = new ProductManager('productos.json');

productManager.addProduct({
  title: 'Producto de ejemplo',
  description: 'Descripción del producto de ejemplo',
  price: 50,
  thumbnail: 'imagen.jpg',
  code: 'ABC123',
  stock: 20
});

console.log(productManager.getProducts());

productManager.updateProduct(1, { price: 60 });
productManager.deleteProduct(1);

uploadToServer(productos.json); 