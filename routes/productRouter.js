const express = require('express');
const productManager = require('../dao/ProductManager');
const productRouter = express.Router();

productRouter.get('/', async (req, res) => {
  const { limit = 10, page = 1, sort, query } = req.query;
  try {
    const result = await productManager.getProducts({ limit, page, sort, query });
    res.json(result);
  } catch (error) {
    console.error("Error al obtener los productos:", error.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = productRouter;