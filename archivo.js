const fs = require('fs');

class ProductManager {
  constructor(filePath) {
    this.path = filePath;
    this.products = [];
    this.loadProducts();
  }

  loadProducts() {
    try {
      const data = fs.readFileSync(this.path, 'utf8');
      if (data) {
        this.products = JSON.parse(data);
      }
    } catch (error) {
      console.log("Error al cargar los productos:", error.message);
    }
  }

  saveProducts() {
    try {
      fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2), 'utf8');
      console.log("Productos guardados correctamente en el archivo.");
    } catch (error) {
      console.log("Error al guardar los productos:", error.message);
    }
  }

  addProduct(productData) {
    const newProductId = this.products.length > 0 ? this.products[this.products.length - 1].id + 1 : 1;
    const newProduct = {
      id: newProductId,
      ...productData
    };
    this.products.push(newProduct);
    this.saveProducts();
  }

  getProducts() {
    return this.products;
  }

  getProductById(id) {
    return this.products.find(product => product.id === id);
  }

  updateProduct(id, updatedFields) {
    const index = this.products.findIndex(product => product.id === id);
    if (index !== -1) {
      this.products[index] = { ...this.products[index], ...updatedFields };
      this.saveProducts();
    } else {
      console.log("Producto no encontrado.");
    }
  }

  deleteProduct(id) {
    const index = this.products.findIndex(product => product.id === id);
    if (index !== -1) {
      this.products.splice(index, 1);
      this.saveProducts();
      console.log("Producto eliminado correctamente.");
    } else {
      console.log("Producto no encontrado.");
    }
  }
}

module.exports = ProductManager;