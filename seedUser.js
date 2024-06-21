const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('./config');
const User = require('./dao/models/userModel');

async function createAdminUser() {
  try {
    await mongoose.connect(config.mongodbURI);
    console.log('Conexión a MongoDB Atlas establecida');

    const adminEmail = 'admin@example.com';
    const adminPassword = 'securepassword';
    const adminUsername = 'admin';


    const existingAdmin = await User.findOne({ username: adminUsername });
    if (existingAdmin) {
      console.log('El usuario administrador ya existe:', existingAdmin);
      return;
    }


    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const user = new User({
      username: adminUsername,
      email: adminEmail,
      password: hashedPassword,
      role: 'admin'
    });

    const savedUser = await user.save();
    console.log('Usuario administrador insertado con éxito:', savedUser);
  } catch (err) {
    console.error('Error al insertar usuario administrador:', err);
  } finally {
    mongoose.connection.close();
  }
}

createAdminUser();