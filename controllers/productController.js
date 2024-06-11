const DAOFactory = require('../dao/daoFactory');
const Product = require('../dao/models/productSchema');
const User = require('../dao/models/userModel');

const productManager = DAOFactory.getDAO('fileSystem');

const productController = {
  getProducts: async (req, res) => {
    const { limit = 10, page = 1, sort, query } = req.query;
    try {
      const result = await productManager.getProducts({ limit, page, sort, query });
      res.json(result);
    } catch (error) {
      console.error("Error al obtener los productos:", error.message);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  },

  addProduct: async (req, res) => {
    const productData = req.body;
    try {
      await productManager.addProduct(productData);
      res.status(201).json({ message: 'Producto creado exitosamente' });
    } catch (error) {
      console.error("Error al crear el producto:", error.message);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  },

  getProductById: async (req, res) => {
    const productId = req.params.id;
    try {
      const product = await productManager.getProductById(productId);
      if (product) {
        res.json(product);
      } else {
        res.status(404).json({ error: 'Producto no encontrado' });
      }
    } catch (error) {
      console.error("Error al obtener el producto:", error.message);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  },

  updateProduct: async (req, res) => {
    const productId = req.params.id;
    const updatedProductData = req.body;
    try {
      const product = await Product.findById(productId);

      if (!product) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }
      
      if (req.user.role === 'admin' || product.owner.equals(req.user._id)) {
        await productManager.updateProduct(productId, updatedProductData);
        return res.json({ message: 'Producto actualizado exitosamente' });
      } else {
        return res.status(403).json({ error: 'No tienes permiso para actualizar este producto' });
      }
    } catch (error) {
      console.error("Error al actualizar el producto:", error.message);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  },

  deleteProduct: async (req, res) => {
    const productId = req.params.id;
    try {
      const product = await Product.findById(productId);

      if (!product) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }
      
      if (req.user.role === 'admin' || product.owner.equals(req.user._id)) {
        await productManager.deleteProduct(productId);
        return res.json({ message: 'Producto eliminado exitosamente' });
      } else {
        return res.status(403).json({ error: 'No tienes permiso para eliminar este producto' });
      }
    } catch (error) {
      console.error("Error al eliminar el producto:", error.message);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }
};

module.exports = productController;