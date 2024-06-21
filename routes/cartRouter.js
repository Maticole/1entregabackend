const express = require('express');
const cartController = require('../controllers/cartController');
const { authorizeUser } = require('../utils/authMiddleware');
const authController = require('../controllers/authController');
const cartRouter = express.Router();
const { errorHandler } = require('../utils/errorHandler');

/**
 * @swagger
 * /api/carts/{cid}:
 *   get:
 *     summary: Obtiene el carrito de un usuario.
 *     description: Retorna el carrito de compras de un usuario específico.
 *     parameters:
 *       - in: path
 *         name: cid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del carrito de compras a obtener.
 *     responses:
 *       '200':
 *         description: Carrito de compras obtenido con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       '404':
 *         description: Carrito de compras no encontrado.
 *       '500':
 *         description: Error interno del servidor.
 */
cartRouter.get('/:cid', authorizeUser(['user', 'admin', 'premium']), errorHandler(cartController.getCart));

/**
 * @swagger
 * /api/carts/{cid}/add/{pid}:
 *   post:
 *     summary: Agrega un producto al carrito.
 *     description: Agrega un producto específico al carrito de compras de un usuario.
 *     parameters:
 *       - in: path
 *         name: cid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del carrito de compras al que se agregará el producto.
 *       - in: path
 *         name: pid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto a agregar al carrito.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Producto agregado al carrito exitosamente.
 *       '404':
 *         description: Carrito de compras o producto no encontrado.
 *       '500':
 *         description: Error interno del servidor.
 */
cartRouter.post('/:cid/add/:pid', authorizeUser(['user', 'admin', 'premium']), errorHandler(cartController.addToCart));

/**
 * @swagger
 * /api/carts/{cid}/remove/{pid}:
 *   delete:
 *     summary: Elimina un producto del carrito.
 *     description: Elimina un producto específico del carrito de compras de un usuario.
 *     parameters:
 *       - in: path
 *         name: cid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del carrito de compras del que se eliminará el producto.
 *       - in: path
 *         name: pid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto a eliminar del carrito.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Producto eliminado del carrito exitosamente.
 *       '404':
 *         description: Carrito de compras o producto no encontrado.
 *       '500':
 *         description: Error interno del servidor.
 */
cartRouter.delete('/:cid/remove/:pid', authorizeUser(['user', 'admin', 'premium']), errorHandler(cartController.removeFromCart));

/**
 * @swagger
 * /api/carts/{cid}/purchase:
 *   post:
 *     summary: Realiza una compra con el carrito especificado.
 *     description: Realiza una compra con los productos en el carrito de compras especificado.
 *     parameters:
 *       - in: path
 *         name: cid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del carrito de compras para realizar la compra.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Compra realizada exitosamente.
 *       '400':
 *         description: No hay suficiente stock para completar la compra.
 *       '500':
 *         description: Error interno del servidor.
 */
cartRouter.post('/:cid/purchase', authorizeUser(['user', 'admin', 'premium']), errorHandler(cartController.purchaseCart));

module.exports = cartRouter;