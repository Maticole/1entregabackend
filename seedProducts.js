const mongoose = require('mongoose');
const config = require('./config');
const Product = require('./dao/models/productSchema');
const User = require('./dao/models/userModel');

mongoose.connect(config.mongodbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Conexión a MongoDB Atlas establecida');

    const user = await User.findOne({ username: 'admin' });

    if (!user) {
      console.error('No se encontró ningún usuario en la base de datos');
      mongoose.connection.close();
      return;
    }

    const ownerId = user._id;

    const products = [
      { name: "Remera Manga Corta", description: "Remera de algodón, manga corta, disponible en varios colores", price: 25, owner: ownerId },
      { name: "Remera Manga Larga", description: "Remera de algodón, manga larga, disponible en varios colores", price: 30, owner: ownerId },
      { name: "Pantalón Jean", description: "Pantalón de jean, estilo clásico, disponible en varias tallas", price: 50, owner: ownerId },
      { name: "Buzo con Capucha", description: "Buzo de algodón con capucha, disponible en varios colores", price: 40, owner: ownerId },
      { name: "Gorra", description: "Gorra ajustable, disponible en varios colores y diseños", price: 15, owner: ownerId },
      { name: "Zapatillas Deportivas", description: "Zapatillas deportivas, cómodas y ligeras, disponibles en varias tallas", price: 60, owner: ownerId },
      { name: "Camisa Formal", description: "Camisa de algodón, estilo formal, disponible en varios colores", price: 35, owner: ownerId },
      { name: "Medias", description: "Pack de 3 pares de medias de algodón, disponibles en varios colores", price: 10, owner: ownerId },
      { name: "Cinturón de Cuero", description: "Cinturón de cuero genuino, disponible en negro y marrón", price: 20, owner: ownerId },
      { name: "Short Deportivo", description: "Short de tela deportiva, ligero y cómodo, disponible en varios colores", price: 25, owner: ownerId },
      { name: "Chaleco", description: "Chaleco acolchado, ideal para climas fríos, disponible en varios colores", price: 45, owner: ownerId },
      { name: "Chaqueta de Cuero", description: "Chaqueta de cuero genuino, disponible en negro y marrón", price: 100, owner: ownerId },
      { name: "Vestido de Verano", description: "Vestido de algodón, ligero y cómodo, disponible en varios colores y diseños", price: 35, owner: ownerId },
      { name: "Sudadera", description: "Sudadera de algodón, disponible en varios colores", price: 30, owner: ownerId },
      { name: "Traje de Baño", description: "Traje de baño, disponible en varios colores y tallas", price: 20, owner: ownerId }
    ];

    await Product.insertMany(products)
      .then(() => {
        console.log('Productos insertados con éxito');
        mongoose.connection.close();
      })
      .catch(err => {
        console.error('Error al insertar productos:', err);
        mongoose.connection.close();
      });
  })
  .catch(err => console.error('Error al conectar a MongoDB Atlas:', err));