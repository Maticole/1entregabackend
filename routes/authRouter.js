const express = require('express');
const passport = require('../utils/passportConfig');
const bcrypt = require('bcrypt');
const User = require('../dao/models/userModel');
const authController = require('../controllers/authController');

const authRouter = express.Router();

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

authRouter.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      console.error('Error en autenticación:', err);
      return next(err);
    }
    if (!user) {
      req.flash('error', info.message);
      return res.redirect('/login');
    }
    req.logIn(user, (err) => {
      if (err) {
        console.error('Error al iniciar sesión:', err);
        return next(err);
      }
      req.flash('success', 'Autenticación exitosa');
      return redirectBasedOnRole(req, res);
    });
  })(req, res, next);
});

authRouter.post('/register', async (req, res) => {
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

authRouter.post('/request-password-reset', authController.requestPasswordReset);
authRouter.post('/reset-password', authController.resetPassword);
authRouter.post('/update-password', authController.updatePassword);
authRouter.get('/current', authController.getCurrentUserDTO);

module.exports = authRouter;