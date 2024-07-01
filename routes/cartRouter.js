const express = require('express');
const cartController = require('../controllers/cartController');
const { isAuthenticated, authorizeUser } = require('../utils/authMiddleware');
const cartRouter = express.Router();
const { errorHandler } = require('../utils/errorHandler');
const { authenticate } = require('passport');

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Operaciones relacionadas con el carrito de compras.
 */

/**
 * @swagger
 * /api/carts:
 *   post:
 *     summary: Agrega un producto al carrito.
 *     description: Agrega un producto específico al carrito de compras de un usuario.
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *                 description: ID del producto a agregar al carrito.
 *             example:
 *               productId: 666b32943c5250003a004e95
 *     responses:
 *       '200':
 *         description: Producto agregado al carrito exitosamente.
 *       '400':
 *         description: Error en la solicitud, por ejemplo, falta el ID del producto.
 *       '403':
 *         description: No puedes agregar tu propio producto al carrito si eres premium.
 *       '404':
 *         description: Producto no encontrado.
 *       '500':
 *         description: Error interno del servidor.
 */
cartRouter.post('/', isAuthenticated, authorizeUser(['user', 'admin', 'premium']), errorHandler(cartController.addToCart));

/**
 * @swagger
 * /api/carts/{cid}/remove/{pid}:
 *   delete:
 *     summary: Elimina un producto del carrito.
 *     description: Elimina un producto específico del carrito de compras de un usuario.
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cid
 *         required: true
 *         schema:
 *           type: string
 *           description: ID del carrito de compras del que se eliminará el producto.
 *       - in: path
 *         name: pid
 *         required: true
 *         schema:
 *           type: string
 *           description: ID del producto a eliminar del carrito.
 *     responses:
 *       '204':
 *         description: Producto eliminado del carrito exitosamente.
 *       '404':
 *         description: Carrito de compras o producto no encontrado.
 *       '500':
 *         description: Error interno del servidor.
 */
cartRouter.delete('/:cid/remove/:pid', isAuthenticated, authorizeUser(['user', 'admin', 'premium']), cartController.removeFromCart);

/**
 * @swagger
 * /api/carts/{cid}/purchase:
 *   post:
 *     summary: Realiza una compra con el carrito especificado.
 *     description: Realiza una compra con los productos en el carrito de compras especificado.
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cid
 *         required: true
 *         schema:
 *           type: string
 *           description: ID del carrito de compras para realizar la compra.
 *     responses:
 *       '200':
 *         description: Compra realizada exitosamente.
 *       '400':
 *         description: No hay suficiente stock para completar la compra.
 *       '500':
 *         description: Error interno del servidor.
 */
cartRouter.post('/:cid/purchase', isAuthenticated, authorizeUser(['user', 'admin', 'premium']), errorHandler(cartController.purchaseCart));

/**
 * @swagger
 * /api/carts/view:
 *   get:
 *     summary: Vista del carrito de compras.
 *     description: Obtiene y muestra el carrito de compras actual del usuario.
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Vista del carrito de compras.
 *       '500':
 *         description: Error interno del servidor.
 */
cartRouter.get('/view', isAuthenticated, authorizeUser(['user', 'admin', 'premium']), errorHandler(cartController.viewCart));

/**
 * @swagger
 * /api/carts/add-multiple:
 *   post:
 *     summary: Agrega múltiples productos al carrito.
 *     description: Agrega múltiples productos al carrito de compras de un usuario.
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               products:
 *                 type: object
 *                 additionalProperties:
 *                   type: integer
 *                 description: Objeto donde las claves son los IDs de producto y los valores son las cantidades a agregar.
 *             example:
 *               products:
 *                 '666b32943c5250003a004e95': 3
 *                 '666b32943c5250003a004e96': 1
 *     responses:
 *       '200':
 *         description: Productos agregados al carrito exitosamente.
 *       '500':
 *         description: Error interno del servidor.
 */
cartRouter.post('/add-multiple', isAuthenticated, authorizeUser(['user', 'admin', 'premium']), errorHandler(cartController.addMultipleToCart));

module.exports = cartRouter;    