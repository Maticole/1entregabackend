const express = require('express');
const expressHandlebars = require('express-handlebars');
const http = require('http');
const socketIO = require('socket.io');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const config = require('./config');
const ProductManager = require('./dao/fileSystem/ProductManager');
const productRouter = require('./routes/productRouter');
const cartRouter = require('./routes/cartRouter');
const authRouter = require('./routes/authRouter');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const productManager = new ProductManager('./data/productos.json');

const PORT = 8080;

app.use(session({ secret: config.sessionSecret, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());


app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
app.use('/auth', authRouter);


mongoose.connect(config.mongodbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conexión a MongoDB Atlas establecida'))
  .catch(err => console.error('Error al conectar a MongoDB Atlas:', err));

server.listen(config.port, () => {
  console.log(`Servidor Express iniciado en el puerto ${config.port}`);
});

const hbs = expressHandlebars.create({
  defaultLayout: 'main',
  extname: '.handlebars',
});

const expressSession = require('express-session');
app.use(expressSession({
  secret: 'miSecreto',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

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
    
    io.emit('actualizarProductos', await productManager.getAllProducts());
  });
});


app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  
  if (email === '' || password === '') {
    
  res.redirect('/productos');
} else {
  
  res.redirect('/login?error=credencialesInvalidas');
}
});