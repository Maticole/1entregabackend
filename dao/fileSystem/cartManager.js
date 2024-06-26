const Cart = require('../models/cartSchema'); 

class CartManager {
  constructor() {
    this.Cart = Cart;
  }

  async createCart(userId) {
    try {
      const newCart = new this.Cart({ userId, products: [] });
      await newCart.save();
      console.log("Carrito creado correctamente.");
      return newCart;
    } catch (error) {
      console.error("Error al crear el carrito:", error.message);
      return null;
    }
  }

  async getCartById(id) {
    try {
      return await this.Cart.findById(id).populate('products.productId');
    } catch (error) {
      console.error("Error al obtener el carrito por ID:", error.message);
      return null;
    }
  }

  async addToCart(userId, productId) {
    try {
      let cart = await this.Cart.findOne({ userId });
      if (!cart) {
        cart = new this.Cart({ userId, products: [] });
      }

      const productIndex = cart.products.findIndex(
        (product) => product.productId.toString() === productId
      );

      if (productIndex !== -1) {
        cart.products[productIndex].quantity += 1;
      } else {
        cart.products.push({ productId, quantity: 1 });
      }

      await cart.save();
      return cart;
    } catch (error) {
      console.error("Error al agregar producto al carrito:", error.message);
      return null;
    }
  }

  async removeFromCart(userId, productId) {
    try {
      const cart = await this.Cart.findOne({ userId });
      if (!cart) {
        return null;
      }

      cart.products = cart.products.filter(
        (product) => product.productId.toString() !== productId
      );

      await cart.save();
      return cart;
    } catch (error) {
      console.error("Error al eliminar producto del carrito:", error.message);
      return null;
    }
  }
}

module.exports = CartManager;