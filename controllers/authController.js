const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const User = require('../dao/models/userModel');
const UserDTO = require('../dto/dto');

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
};


const sendPasswordResetEmail = async (email, token) => {
  const transporter = nodemailer.createTransport({

  });

  const mailOptions = {
    from: 'your@example.com',
    to: email,
    subject: 'Recuperación de contraseña',
    text: `Haga clic en el siguiente enlace para restablecer su contraseña: ${process.env.CLIENT_URL}/reset-password/${token}`,
  };

  await transporter.sendMail(mailOptions);
};


const requestPasswordReset = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const token = generateToken({ email });
    await sendPasswordResetEmail(email, token);

    return res.status(200).json({ message: 'Correo de restablecimiento enviado' });
  } catch (error) {
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};


const resetPassword = async (req, res, next) => {
  try {
    const { newPassword } = req.body;
    const user = req.user;


    if (!newPassword) {
      return res.status(400).json({ message: 'Se requiere una nueva contraseña' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);


    user.password = hashedPassword;
    await user.save();


    return res.status(200).json({ message: 'Contraseña restablecida exitosamente' });
  } catch (error) {

    console.error('Error al restablecer la contraseña:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const updatePassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const user = req.user;

    if (!newPassword) {
      return res.status(400).json({ message: 'Se requiere una nueva contraseña' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.status(200).json({ message: 'Contraseña actualizada exitosamente' });
  } catch (error) {
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const authorizeUser = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(403).send({ message: 'No token provided.' });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(500).send({ message: 'Failed to authenticate token.' });
    }
    req.userId = decoded.id;
    next();
  });
};

const getCurrentUserDTO = async (req, res) => {
  try {
    const user = req.user; 
   
    const userDTO = new UserDTO(user);
    
    return res.status(200).json(userDTO);
  } catch (error) {
    console.error('Error al obtener el usuario actual:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = {
  requestPasswordReset,
  resetPassword,
  updatePassword,
  authorizeUser,
  getCurrentUserDTO,
};