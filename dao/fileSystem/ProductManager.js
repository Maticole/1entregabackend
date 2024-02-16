const mongoose = require('mongoose');

s
const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true }
 
});


const Product = mongoose.model('Product', productSchema);

class ProductManager {
  constructor() {
    
  }

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
      return await Product.find();
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
}

module.exports = ProductManager;



