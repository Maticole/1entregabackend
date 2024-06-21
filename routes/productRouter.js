const express = require('express');
const productController = require('../controllers/productController');
const { authorizeUser } = require('../utils/authMiddleware');
const authController = require('../controllers/authController');
const productRouter = express.Router();
const mockingModule = require('../utils/mockingModule');
const { errorHandler, errorDictionary } = require('../utils/errorHandler');

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Obtiene la lista de productos.
 *     description: Retorna la lista de productos disponibles.
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Limita la cantidad de productos retornados.
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Número de página para la paginación.
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Campo por el cual se debe ordenar la lista (ascendente o descendente).
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         description: Consulta para filtrar productos por categoría.
 *     responses:
 *       '200':
 *         description: Lista de productos obtenida con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       '500':
 *         description: Error interno del servidor.
 */
productRouter.get('/', errorHandler(productController.getProducts));

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Agrega un nuevo producto.
 *     description: Crea un nuevo producto en la base de datos.
 *     parameters:
 *       - in: body
 *         name: productData
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/ProductInput'
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '201':
 *         description: Producto creado exitosamente.
 *       '500':
 *         description: Error interno del servidor.
 */
productRouter.post('/', authorizeUser(['admin', 'premium']), errorHandler(productController.addProduct));

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Obtiene un producto por su ID.
 *     description: Retorna un producto específico basado en su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto a obtener.
 *     responses:
 *       '200':
 *         description: Producto obtenido con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       '404':
 *         description: Producto no encontrado.
 *       '500':
 *         description: Error interno del servidor.
 */
productRouter.get('/:id', errorHandler(productController.getProductById));

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Actualiza un producto existente.
 *     description: Actualiza los datos de un producto existente.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto a actualizar.
 *       - in: body
 *         name: updatedProductData
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/ProductInput'
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Producto actualizado exitosamente.
 *       '403':
 *         description: No tienes permiso para actualizar este producto.
 *       '404':
 *         description: Producto no encontrado.
 *       '500':
 *         description: Error interno del servidor.
 */
productRouter.put('/:id', authorizeUser(['admin', 'premium']), errorHandler(productController.updateProduct));

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Elimina un producto existente.
 *     description: Elimina un producto existente de la base de datos.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto a eliminar.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Producto eliminado exitosamente.
 *       '403':
 *         description: No tienes permiso para eliminar este producto.
 *       '404':
 *         description: Producto no encontrado.
 *       '500':
 *         description: Error interno del servidor.
 */
productRouter.delete('/:id', authorizeUser(['admin', 'premium']), errorHandler(productController.deleteProduct));

module.exports = productRouter;