const fs = require('fs');

class CartManager {
  constructor(filePath) {
    this.path = filePath;
    this.carts = [];
    this.loadCarts();
  }

  loadCarts() {
    try {
      const data = fs.readFileSync(this.path, 'utf8');
      if (data) {
        this.carts = JSON.parse(data);
      } else {
       
        this.carts = [{ id: 1, products: [] }];
        this.saveCarts();
      }
    } catch (error) {
      console.log("Error al cargar los carritos:", error.message);
    }
  }

  saveCarts() {
    try {
      fs.writeFileSync(this.path, JSON.stringify(this.carts, null, 2), 'utf8');
      console.log("Carritos guardados correctamente en el archivo.");
    } catch (error) {
      console.log("Error al guardar los carritos:", error.message);
    }
  }

  createCart() {
    const newCartId = this.carts.length > 0 ? this.carts[this.carts.length - 1].id + 1 : 1;
    const newCart = {
      id: newCartId,
      products: []
    };
    this.carts.push(newCart);
    this.saveCarts();
    return newCart;
  }

  getCartById(id) {
    return this.carts.find(cart => cart.id === id);
  }


}

module.exports = CartManager;