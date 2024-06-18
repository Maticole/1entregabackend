const express = require('express');
const passport = require('../utils/passportConfig');
const bcrypt = require('bcrypt');
const User = require('../dao/models/userModel');
const authController = require('../controllers/authController');

const authRouter = express.Router();

authRouter.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login?error=true'
}));

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