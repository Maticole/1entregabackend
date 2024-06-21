# Proyecto Backend -Matias Farah

## Descripción

Este proyecto es una API backend que gestiona productos y carritos de compras. Utiliza Node.js con Express, MongoDB para la base de datos, Mongoose para la modelación de datos y Passport para la autenticación. También incluye una integración con Swagger para la documentación de la API.

## Estructura del Proyecto

La estructura del proyecto es la siguiente:

proyecto/
├── controllers/
│ ├── authController.js
│ ├── authController.test.js
│ ├── cartController.js
│ ├── productController.js
│ └── userController.js
├── dao/
│ ├── fileSystem/
│ │ ├── cartManager.js
│ │ └── ProductManager.js
│ ├── models/
│ │ ├── cartSchema.js
│ │ ├── messageSchema.js
│ │ ├── productSchema.js
│ │ ├── ticketModel.js
│ │ └── userModel.js
│ ├── daoFactory.js
│ └── userRepository.js
├── data/
│ ├── carrito.json
│ └── producto.json
├── dto/
│ └── dto.js
├── node_modules/
├── public/
│ ├── main.js
│ └── socketScript.js
├── routes/
│ ├── authRouter.js
│ ├── cartRouter.js
│ ├── productRouter.js
│ └── userRouter.js
├── test/
│ ├── authController.test.js
│ ├── cartController.test.js
│ └── productController.test.js
├── utils/
│ ├── errorHandler.js
│ ├── logger.js
│ ├── mockingModule.js
│ ├── passportConfig.js
│ └── uploadFile.js
├── views
│   │  ├── layouts
│   │   └── main.handlebars
│   ├── admin.handlebars
│   ├── cart.handlebars
│   ├── index.handlebars
│   ├── login.handlebars
│   ├── products.handlebars
│   ├── realTimeProducts.handlebars
│   └── register.handlebars
├── .env
├── .gitignore
├── app.js
├── config.js
├── jest.config.js
├── multerConfig.js
├── package-lock.json
├── package.json
├── README.md
├── seeProducts.js
└── seedUser.js


## Configuración del Entorno

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:

PORT=8080
MONGODB_URI=<TU_URI_DE_MONGODB>
SESSION_SECRET=<TU_SECRETO_DE_SESION>
GITHUB_CLIENT_ID=<TU_CLIENT_ID_DE_GITHUB>
GITHUB_CLIENT_SECRET=<TU_CLIENT_SECRET_DE_GITHUB>

### Instalación de Dependencias

Ejecuta el siguiente comando para instalar las dependencias del proyecto:

```bash
npm install

Uso del Proyecto
Scripts de NPM

start: Inicia el servidor en modo producción.

dev: Inicia el servidor en modo desarrollo con nodemon.

test: Ejecuta las pruebas con Jest.

Comandos

Para iniciar el servidor en modo desarrollo:
npm run dev
npm start
npm test

Documentación de la API
La documentación de la API se genera automáticamente con Swagger. Para acceder a ella, inicia el servidor y navega a:
http://localhost:8080

Estructura de Carpetas y Archivos
Controllers
Contiene los controladores que gestionan las rutas y la lógica de negocio.

DAO
Gestión de datos y acceso a la base de datos. fileSystem para la gestión de archivos y models para los esquemas de Mongoose.

Data
Archivos JSON con datos predefinidos para carritos y productos.

DTO
Definiciones de objetos de transferencia de datos.

Public
Archivos públicos estáticos (JS).

Routes
Definiciones de rutas para la API.

Test
Pruebas unitarias para los controladores.

Utils
Utilidades y configuraciones auxiliares.

Views
Vistas de Handlebars para el frontend.
