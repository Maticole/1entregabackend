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
const flash = require('connect-flash');
const bcrypt = require('bcrypt');
const User = require('./dao/models/userModel');
const methodOverride = require('method-override');
const adminRouter = require('./routes/adminRouter');


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

function redirectBasedOnRole(req, res) {
  const role = req.user.role;
  if (role === 'admin') {
    return res.redirect('/admin');
  } else if (role === 'premium') {
    return res.redirect('/premium');
  } else {
    return res.redirect('/user');
  }
}

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride('_method'));

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

    app.use(flash());
    app.use((req, res, next) => {
      res.locals.successMessages = req.flash('success');
      res.locals.errorMessages = req.flash('error');
      next();
    });


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

    

     const hbs = expressHandlebars.create({
       defaultLayout: null,
       extname: '.handlebars',
       partialsDir: path.join(__dirname, 'views', 'partials'),
       runtimeOptions: {
         allowProtoPropertiesByDefault: true,
         allowProtoMethodsByDefault: true,
       },

       helpers: {
        eq: (a, b) => a === b,
        multiply: (a, b) => a * b,
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
    app.use('/', adminRouter);

    app.get('/', isAuthenticated, (req, res) => {
      redirectBasedOnRole(req, res);
    });

    app.get('/admin', isAuthenticated, authorizeUser(['admin']), async (req, res) => {
      try {
        const productos = await productManager.getAllProducts();
        res.render('admin', { products: productos, user: req.user });
      } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).send('Error interno del servidor');
      }
    });

    app.get('/premium', isAuthenticated, authorizeUser(['premium']), async (req, res) => {
      try {
        const productos = await productManager.getAllProducts();
        res.render('premium', { products: productos, user: req.user });
      } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).send('Error interno del servidor');
      }
    });

    app.get('/user', isAuthenticated, authorizeUser(['user']), async (req, res) => {
      try {
        const productos = await productManager.getAllProducts();
        res.render('user', { products: productos, user: req.user });
      } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).send('Error interno del servidor');
      }
    });

    app.get('/cart', isAuthenticated, authorizeUser(['user', 'premium', 'admin']), async (req, res) => {
      try {
        const cart = await Cart.findOne({ userId: req.user.id }).populate('products.productId');
    
        if (cart) {
          const totalQuantity = cart.products.reduce((sum, product) => sum + product.quantity, 0);
          const totalPrice = cart.products.reduce((sum, product) => sum + (product.quantity * product.productId.price), 0);
    
          res.render('cart', { cart, totalQuantity, totalPrice });
        } else {
          res.render('cart', { cart: null, totalQuantity: 0, totalPrice: 0 });
        }
      } catch (error) {
        console.error('Error al obtener carrito:', error);
        res.status(500).send('Error interno del servidor');
      }
    });

    app.get('/login', (req, res) => {
      res.render('login');
    });

    app.post('/login', (req, res, next) => {
      console.log('Intento de login para:', req.body.email);
      passport.authenticate('local', (err, user, info) => {
        if (err) {
          console.error('Error en autenticación:', err);
          return next(err);
        }
        if (!user) {
          console.log('Usuario no encontrado o contraseña incorrecta:', info.message);
          req.flash('error', info.message);
          return res.redirect('/login');
        }
        req.logIn(user, (err) => {
          if (err) {
            console.error('Error al iniciar sesión:', err);
            return next(err);
          }
          console.log('Autenticación exitosa para usuario:', user.email);
          req.flash('success', 'Autenticación exitosa');
          return redirectBasedOnRole(req, res);
        });
      })(req, res, next);
    });

    app.get('/register', (req, res) => {
      res.render('register');
    });

    app.post('/register', async (req, res) => {
      const { email, password, username } = req.body;
      try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          req.flash('error', 'El email ya está registrado.');
          return res.redirect('/register');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, password: hashedPassword, username });
        await newUser.save();
        req.flash('success', 'Registro exitoso, por favor inicie sesión');
        res.redirect('/login');
      } catch (error) {
        console.error('Error al registrar usuario:', error);
        req.flash('error', 'Error al registrar usuario');
        res.redirect('/register');
      }
    });

    app.get('/logout', (req, res, next) => {
      req.logout((err) => {
        if (err) { return next(err); }
        req.session.destroy((err) => {
          if (err) {
            console.error('Error destroying session:', err);
          }
          res.clearCookie('connect.sid');
          res.redirect('/login');
        });
      });
    });

    app.post('/api/carts/remove/:productId', isAuthenticated, authorizeUser(['user', 'premium', 'admin']), cartController.removeFromCart);
    app.post('/api/carts/purchase/:cartId', isAuthenticated, authorizeUser(['user', 'premium', 'admin']), cartController.purchaseCart);

    server.listen(PORT, () => {
      console.log(`Servidor escuchando en el puerto ${PORT}`);
    });

    io.on('connection', (socket) => {
      console.log('Nuevo cliente conectado');

      socket.on('disconnect', () => {
        console.log('Cliente desconectado');
      });
    });
    
  })
  .catch(err => {
    console.error('Error al conectar a MongoDB Atlas:', err);
  });

