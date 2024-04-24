const logger = require('../utils/logger');
const authController = require('../controllers/authController');

describe('Controlador de Autenticación', () => {
  test('Debería devolver estado 200 al iniciar sesión con credenciales correctas', () => {
    const req = {};
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    logger.info('Iniciando prueba de inicio de sesión...');

    authController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();

    logger.info('Prueba de inicio de sesión completada.');
  });
});