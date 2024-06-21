const passport = require('passport');

/**
 * Middleware para verificar roles de usuario.
 * @param {Array} roles - Lista de roles permitidos.
 * @returns {Function} Middleware de autorización.
 */
const authorizeUser = (roles) => {
    return (req, res, next) => {
      console.log('Verificando autenticación del usuario:', req.isAuthenticated());
  
      if (!req.isAuthenticated()) {
        console.log('Usuario no autenticado.');
        return res.redirect('/login');
      }

    const userRole = req.user.role;
    console.log('Rol del usuario:', userRole);

    if (roles.includes(userRole)) {
      return next();
    } else {
      console.log('Usuario no tiene permiso para acceder a esta página.');
      return res.status(403).json({ message: 'No tienes permiso para acceder a esta página.' });
    }
  };
};

module.exports = { authorizeUser };