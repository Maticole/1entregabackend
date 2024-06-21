const express = require('express');
const passport = require('../utils/passportConfig');
const bcrypt = require('bcrypt');
const User = require('../dao/models/userModel');
const authController = require('../controllers/authController');

const authRouter = express.Router();

authRouter.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      console.error('Error en autenticación:', err);
      return next(err);
    }
    if (!user) {
      console.log('Fallo de autenticación:', info.message);
      return res.redirect('/login?error=true');
    }
    req.logIn(user, (err) => {
      if (err) {
        console.error('Error al iniciar sesión:', err);
        return next(err);
      }
      console.log('Autenticación exitosa:', user);
      return res.redirect('/');
    });
  })(req, res, next);
});

authRouter.post('/register', async (req, res) => {
  const { email, password, username } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword, username });
    await newUser.save();
    res.redirect('/login');
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).send('Error al registrar usuario');
  }
});

authRouter.post('/request-password-reset', authController.requestPasswordReset);

authRouter.post('/reset-password', authController.resetPassword);

authRouter.post('/update-password', authController.updatePassword);

authRouter.get('/current', authController.getCurrentUserDTO);

module.exports = authRouter;