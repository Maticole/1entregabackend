const express = require('express');
const expressHandlebars = require('express-handlebars');
const http = require('http');
const socketIO = require('socket.io');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const helmet = require('helmet');
const path = require('path');
const config = require('./config');
const ProductManager = require('./dao/fileSystem/ProductManager');
const productRouter = require('./routes/productRouter');
const cartRouter = require('./routes/cartRouter');
const authRouter = require('./routes/authRouter');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const TicketModel = require('./dao/models/ticketModel');
const Cart = require('./dao/models/cartSchema'); 

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const productManager = new ProductManager();

const PORT = config.port || 8080;

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'none'"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
      styleSrc: ["'self'", "https://fonts.googleapis.com", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "/socket.io/socket.io.js"],
      imgSrc: ["'self'", "data:"],
      connectSrc: ["'self'", "ws:"], 
    },
  })
);

app.use(session({ secret: config.sessionSecret, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(config.mongodbURI)
  .then(() => console.log('Conexión a MongoDB Atlas establecida'))
  .catch(err => console.error('Error al conectar a MongoDB Atlas:', err));

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Productos y Carrito',
      version: '1.0.0',
      description: 'Documentación de la API de Productos y Carrito',
    },
    components: {
      schemas: {
        Product: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            description: { type: 'string' },
            price: { type: 'number' },
            owner: { type: 'string', format: 'uuid' },
          },
          required: ['name', 'description', 'price', 'owner'],
        },
        ProductInput: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            description: { type: 'string' },
            price: { type: 'number' },
          },
          required: ['name', 'description', 'price'],
        },
        Cart: {
          type: 'object',
          properties: {
            userId: { type: 'string', format: 'uuid' }, 
            products: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  productId: { type: 'string', format: 'uuid' }, 
                  quantity: { type: 'number' }, 
                },
              },
            },
          },
          required: ['userId', 'products'], 
        },
      },
    },
  },
  apis: ['./routes/productRouter.js', './routes/cartRouter.js'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

server.listen(config.port, () => {
  console.log(`Servidor Express iniciado en el puerto ${config.port}`);
});

const hbs = expressHandlebars.create({
  defaultLayout: 'main',
  extname: '.handlebars',
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
app.use('/auth', authRouter);

app.get('/', async (req, res) => {
  try {
    const productos = await productManager.getAllProducts(); 
    res.render('index', { products: productos });
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).send('Error interno del servidor');
  }
});
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

