const DAOFactory = require('../dao/daoFactory');
const cartManager = DAOFactory.getDAO('fileSystem');
const ProductManager = require('../dao/fileSystem/ProductManager');
const productManager = new ProductManager();
const Ticket = require('../dao/models/TicketModel');

async function addToCart(req, res) {
  try {
    const { productId } = req.body;

  
    const isPremium = req.user.role === 'premium';
  
    const product = await productManager.getProductById(productId);
    if (isPremium && product.owner.equals(req.user._id)) {
      return res.status(403).json({ error: 'No puedes agregar tu propio producto al carrito' });
    }
    
    const cart = await cartManager.addToCart(req.user._id, productId);
    return res.status(200).json(cart);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

async function getAllCarts(req, res) {
  try {
    const carts = await cartManager.getAllCarts();
    res.json(carts);
  } catch (error) {
    console.error("Error al obtener los carritos:", error.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

async function removeProductFromCart(req, res) {
  const { cid, pid } = req.params;
  try {
    const cart = await cartManager.getCartById(cid);
    const updatedProducts = cart.products.filter(product => product.productId.toString() !== pid);
    cart.products = updatedProducts;
    await cart.save();
    res.status(204).send();
  } catch (error) {
    console.error("Error al eliminar el producto del carrito:", error.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

async function purchaseCart(req, res) {
  try {
    const { cid } = req.params;
    const cart = await cartManager.getCartById(cid);
    const products = cart.products;

    for (const product of products) {
      const existingProduct = await productManager.getProductById(product.productId);
      if (!existingProduct || existingProduct.stock < product.quantity) {
        return res.status(400).json({ error: 'No hay suficiente stock para completar la compra' });
      }
    }

    for (const product of products) {
      const existingProduct = await productManager.getProductById(product.productId);
      existingProduct.stock -= product.quantity;
      await existingProduct.save();
    }

    const ticket = new Ticket({
      code: 'ABC123',
      amount: 100,
      purchaser: req.user.email,
    });
    await ticket.save();

    res.json({ message: 'Compra realizada exitosamente', ticket });
  } catch (error) {
    console.error('Error al procesar la compra:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

module.exports = {
  addToCart,
  getAllCarts,
  removeProductFromCart,
  purchaseCart,
};