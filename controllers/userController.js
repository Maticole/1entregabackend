const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');

const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;
    
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await User.findOne({ email: payload.email });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const isSamePassword = await bcrypt.compare(newPassword, user.password);

    if (isSamePassword) {
      return res.status(400).json({ message: 'La nueva contraseña no puede ser igual a la actual' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.status(200).json({ message: 'Contraseña restablecida con éxito' });
  } catch (error) {
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = {
  resetPassword,
};