const mongoose = require('mongoose');


const cartSchema = new mongoose.Schema({
  products: [{ productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, quantity: Number }]
  
});


const Cart = mongoose.model('Cart', cartSchema);

class CartManager {
  constructor() {
    
  }

  async createCart() {
    try {
      const newCart = new Cart({ products: [] });
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
      return await Cart.findById(id).populate('products.productId');
    } catch (error) {
      console.error("Error al obtener el carrito por ID:", error.message);
      return null;
    }
  }}

module.exports = CartManager;