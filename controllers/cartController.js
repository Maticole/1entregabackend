const DAOFactory = require('../dao/daoFactory'); 

const cartManager = DAOFactory.getDAO('fileSystem');

const Ticket = require('../models/TicketModel');
const ProductManager = require('../dao/fileSystem/ProductManager');
const productManager = new ProductManager();

async function purchaseCart(req, res) {
  try {
        res.json({ message: 'Compra realizada exitosamente' });
  } catch (error) {
    console.error('Error al procesar la compra:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
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
    await cartManager.removeProductFromCart(cid, pid);
    res.status(204).send();
  } catch (error) {
    console.error("Error al eliminar el producto del carrito:", error.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

module.exports = {
  getAllCarts,
  removeProductFromCart,
  purchaseCart,
 };