require('dotenv').config();

const express = require('express');
const expressHandlebars = require('express-handlebars');
const http = require('http');
const socketIO = require('socket.io');
const mongoose = require('mongoose');
const passport = require('./utils/passportConfig');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const helmet = require('helmet');
const path = require('path');
const config = require('./config');
const ProductManager = require('./dao/fileSystem/ProductManager');
const { authorizeUser } = require('./utils/authMiddleware');
const productRouter = require('./routes/productRouter');
const cartRouter = require('./routes/cartRouter');
const authRouter = require('./routes/authRouter');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const TicketModel = require('./dao/models/ticketModel');
const Cart = require('./dao/models/cartSchema');
const cartController = require('./controllers/cartController');
const bodyParser = require('body-parser');
const handlebarsLayouts = require('handlebars-layouts');
const handlebars = require('handlebars');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const productManager = new ProductManager();

const PORT = config.port || 8080;

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
      styleSrc: ["'self'", "https://fonts.googleapis.com", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "http://localhost:8080/socket.io/socket.io.js"],
      imgSrc: ["'self'", "data:"],
      connectSrc: ["'self'", "ws:"],
    },
  })
);

mongoose.connect(config.mongodbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 10000
})
  .then(() => {
    console.log('Conexión a MongoDB Atlas establecida');


    const sessionOptions = {
      secret: config.sessionSecret,
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({ mongoUrl: config.mongodbURI })
    };

    
    app.use(session(sessionOptions));
    app.use(passport.initialize());
    app.use(passport.session());


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

    handlebarsLayouts.register(handlebars);

    const hbs = expressHandlebars.create({
      defaultLayout: 'main',
      extname: '.handlebars',
      layoutsDir: path.join(__dirname, 'views', 'layouts'),
      partialsDir: path.join(__dirname, 'views', 'partials'),
      helpers: {
        extend: handlebarsLayouts.extend,
        embed: handlebarsLayouts.embed,
        
      },
      runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
      },
    });

   

    app.engine('handlebars', hbs.engine);
    app.set('view engine', 'handlebars');
    app.set('views', path.join(__dirname, 'views'));


    app.use(express.json());
    app.use(express.static(path.join(__dirname, 'public')));


    app.use('/api/products', productRouter);
    app.use('/api/carts', cartRouter);
    app.use('/auth', authRouter);


    app.get('/', isAuthenticated, authorizeUser(['user', 'premium', 'admin']), async (req, res) => {
      try {
        const productos = await productManager.getAllProducts();
        res.render('index', { products: productos });
      } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).send('Error interno del servidor');
      }
    });

    app.get('/cart', isAuthenticated, authorizeUser(['user', 'premium', 'admin']), async (req, res) => {
      try {
        const cart = await Cart.findOne({ userId: req.user.id }).populate('products.productId');
        res.render('cart', { cart });
      } catch (error) {
        console.error('Error al obtener carrito:', error);
        res.status(500).send('Error interno del servidor');
      }
    });

    app.get('/login', (req, res) => {
      res.render('login');
    });

    app.post('/login', passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/login',
      failureFlash: true
    }));

    app.get('/register', (req, res) => {
      res.render('register');
    });

    io.on('connection', (socket) => {
      console.log('Nuevo cliente conectado');

      socket.on('disconnect', () => {
        console.log('Cliente desconectado');
      });
    });

    server.listen(PORT, () => {
      console.log(`Servidor Express iniciado en el puerto ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Error al conectar a MongoDB Atlas:', err);
  });

