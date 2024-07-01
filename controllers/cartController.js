const DAOFactory = require('../dao/daoFactory');
const cartManager = DAOFactory.getDAO('fileSystem');
const ProductManager = require('../dao/fileSystem/ProductManager');
const productManager = new ProductManager();
const Ticket = require('../dao/models/ticketModel');
const { v4: uuidv4 } = require('uuid');

async function addToCart(req, res) {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user._id;

    console.log('Request Body:', req.body);
    console.log('Product ID:', productId);  
    console.log('User ID:', userId);        

    if (!productId || !quantity) {
      return res.status(400).json({ error: 'Product ID and quantity are required' });
    }

    const isPremium = req.user.role === 'premium';

    const product = await productManager.getProductById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    if (isPremium && product.owner.equals(req.user._id)) {
      return res.status(403).json({ error: 'No puedes agregar tu propio producto al carrito' });
    }

    await cartManager.addToCart(userId, productId, quantity);
    return res.redirect('/cart'); 
  } catch (error) {
    console.error('Error al agregar producto al carrito:', error);
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

async function removeFromCart(req, res) {
  const { cid, pid } = req.params;
  try {
    const cart = await cartManager.getCartById(cid); 
    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    const productIndex = cart.products.findIndex(product => product.productId.equals(pid));
    if (productIndex === -1) {
      return res.status(404).json({ error: 'Producto no encontrado en el carrito' });
    }

    cart.products.splice(productIndex, 1); 

    await cart.save(); 

    res.status(204).send(); 
  } catch (error) {
    console.error("Error al eliminar el producto del carrito:", error.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

async function purchaseCart(req, res) {
  try {
    const cartId = req.params.cartId;
    const cart = await cartManager.getCartById(cartId); 
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
      code: uuidv4(), 
      amount: products.reduce((total, product) => total + (product.quantity * product.productId.price), 0),
      purchaser: req.user.email,
    });
    await ticket.save();

    cart.products = [];
    await cart.save();

    res.render('ticket', { ticket, user: req.user });
  } catch (error) {
    console.error('Error al procesar la compra:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

async function viewCart(req, res) {
  const userId = req.user._id;

  try {
    const cart = await cartManager.getCartByUserId(userId);

    if (!cart || cart.products.length === 0) {
      return res.render('cart', { cart: null, totalQuantity: 0, totalPrice: 0 });
    }

    const totalQuantity = cart.products.reduce((sum, product) => sum + product.quantity, 0);
    const totalPrice = cart.products.reduce((sum, product) => sum + (product.quantity * product.productId.price), 0);

    res.render('cart', { cart, totalQuantity, totalPrice });
  } catch (error) {
    console.error("Error al obtener el carrito:", error.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

async function addMultipleToCart(req, res) {
  try {
    const products = req.body.products; 
    const userId = req.user._id;

    for (const [productId, quantity] of Object.entries(products)) {
      for (let i = 0; i < quantity; i++) {
        await cartManager.addToCart(userId, productId);
      }
    }

    res.redirect('/api/carts/view');
  } catch (error) {
    console.error('Error al agregar productos al carrito:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

module.exports = {
  addToCart,
  getAllCarts,
  removeFromCart,
  purchaseCart,
  viewCart,
  addMultipleToCart 
};