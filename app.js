const express = require('express');
const expressHandlebars = require('express-handlebars');
const http = require('http');
const socketIO = require('socket.io');
const mongoose = require('mongoose');
const ProductManager = require('./dao/fileSystem/ProductManager');
const productRouter = require('./routes/productRouter');
const cartRouter = require('./routes/cartRouter');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const productManager = new ProductManager('./data/productos.json');

const PORT = 8080;

const hbs = expressHandlebars.create({
  defaultLayout: 'main',
  extname: '.handlebars',
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.static('public'));

app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);

io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado');

  
  socket.on('nuevoProducto', async (producto) => {
    await productManager.addProduct(producto);

    
    io.emit('actualizarProductos', productManager.getAllProducts());
  });
 
});

mongoose.connect('mongodb+srv://maticole1980:<Trinidad1912>@maticoder.gw5gwny.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Conexión a MongoDB Atlas establecida'))
.catch(err => console.error('Error al conectar a MongoDB Atlas:', err));

server.listen(PORT, () => {
  console.log(`Servidor Express iniciado en el puerto ${PORT}`);
});