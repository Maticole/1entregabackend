const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/userSchema');
const passport = require('passport');

const authRouter = express.Router();

authRouter.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'El usuario ya existe' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'Usuario registrado correctamente' });
  } catch (error) {
    console.error("Error al registrar el usuario:", error.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

authRouter.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    }
    
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }
    
    res.json({ message: 'Inicio de sesión exitoso', user });
  } catch (error) {
    console.error("Error al iniciar sesión:", error.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

authRouter.post('/login', passport.authenticate('local', {
  successRedirect: '/productos',
  failureRedirect: '/login?error=credencialesInvalidas'
}));

authRouter.get('/auth/github', passport.authenticate('github'));
authRouter.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/productos');
  });

module.exports = authRouter;