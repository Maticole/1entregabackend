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

const uploadDocuments = async (req, res) => {
  try {
    const user = await User.findById(req.params.uid);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No se han subido documentos' });
    }

    const documents = req.files.map(file => ({
      name: file.originalname,
      reference: file.path
    }));

    user.documents = documents;
    await user.save();

    return res.status(200).json({ message: 'Documentos subidos exitosamente' });
  } catch (error) {
    console.error('Error al subir documentos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = {
  resetPassword,
  uploadDocuments,
};