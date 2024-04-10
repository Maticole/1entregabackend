const UserRepository = require('../dao/userRepository');
const UserDTO = require('../dto/UserDTO');

const userRepository = new UserRepository();

async function authorizeUser(req, res, next) {
  try {
    if (req.user && req.user.role === 'admin') {
      next();
    } else {
      res.status(403).json({ error: 'Acceso no autorizado' });
    }
  } catch (error) {
    console.error('Error de autorización:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}


async function getCurrentUser(req, res) {
  try {
    const user = await userRepository.getUserById(req.user.id);
    const userDTO = new UserDTO(user);
    res.json(userDTO);
  } catch (error) {
    console.error("Error al obtener el usuario actual:", error.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

module.exports = {
  getCurrentUser,
  authorizeUser,
};