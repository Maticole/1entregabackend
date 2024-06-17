const mongoose = require('mongoose');
const Product = require('../models/productSchema'); 

class ProductManager {
  constructor() { }

  async addProduct(productData) {
    try {
      const newProduct = new Product(productData);
      await newProduct.save();
      console.log("Producto añadido correctamente.");
    } catch (error) {
      console.error("Error al añadir el producto:", error.message);
    }
  }

  async getAllProducts() {
    try {
      const products = await Product.find();
      console.log('Productos obtenidos desde la base de datos:', products); 
      return products;
    } catch (error) {
      console.error("Error al obtener todos los productos:", error.message);
      return [];
    }
  }

  async getProductById(id) {
    try {
      return await Product.findById(id);
    } catch (error) {
      console.error("Error al obtener el producto por ID:", error.message);
      return null;
    }
  }

  async updateProduct(id, updatedFields) {
    try {
      await Product.findByIdAndUpdate(id, updatedFields);
      console.log("Producto actualizado correctamente.");
    } catch (error) {
      console.error("Error al actualizar el producto:", error.message);
    }
  }

  async deleteProduct(id) {
    try {
      await Product.findByIdAndDelete(id);
      console.log("Producto eliminado correctamente.");
    } catch (error) {
      console.error("Error al eliminar el producto:", error.message);
    }
  }

  async getProducts({ limit = 10, page = 1, sort, query }) {
    try {
      let findQuery = {};
      if (query) {
        findQuery = { category: query };
      }
      const totalCount = await Product.countDocuments(findQuery);
      const totalPages = Math.ceil(totalCount / limit);
      const skip = (page - 1) * limit;
      let products = await Product.find(findQuery)
        .limit(limit)
        .skip(skip);
      if (sort) {
        products = products.sort({ price: sort === 'asc' ? 1 : -1 });
      }
      return {
        status: 'success',
        payload: products,
        totalPages,
        prevPage: page > 1 ? page - 1 : null,
        nextPage: page < totalPages ? page + 1 : null,
        page,
        hasPrevPage: page > 1,
        hasNextPage: page < totalPages,
        prevLink: page > 1 ? `/api/products?limit=${limit}&page=${page - 1}` : null,
        nextLink: page < totalPages ? `/api/products?limit=${limit}&page=${page + 1}` : null
      };
    } catch (error) {
      console.error("Error al obtener los productos:", error.message);
      return { status: 'error', error: "Error interno del servidor" };
    }
  }
}

module.exports = ProductManager;



