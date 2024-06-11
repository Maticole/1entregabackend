const errorDictionary = {
    PRODUCT_NOT_FOUND: 'Producto no encontrado.',
    PRODUCT_CREATION_ERROR: 'Error al crear el producto.',
    PRODUCT_UPDATE_ERROR: 'Error al actualizar el producto.',
    PRODUCT_DELETION_ERROR: 'Error al eliminar el producto.',
    AUTHORIZATION_ERROR: 'Error de autorización.',
    INTERNAL_SERVER_ERROR: 'Error interno del servidor.'
};

const errorHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
  errorDictionary,
  errorHandler
};