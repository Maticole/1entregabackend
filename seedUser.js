const mongoose = require('mongoose');
const config = require('./config');
const User = require('./dao/models/userModel');

mongoose.connect(config.mongodbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Conexión a MongoDB Atlas establecida');

    const user = new User({
      username: 'admin',
      email: 'admin@example.com',
      password: 'securepassword',
      role: 'admin'
    });

    await user.save()
      .then(savedUser => {
        console.log('Usuario insertado con éxito:', savedUser);
        mongoose.connection.close();
      })
      .catch(err => {
        console.error('Error al insertar usuario:', err);
        mongoose.connection.close();
      });
  })
  .catch(err => console.error('Error al conectar a MongoDB Atlas:', err));