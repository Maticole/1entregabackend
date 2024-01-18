const express = require('express');
const uploadToServer = require('./uploadFile');

const cartRouter = express.Router();
const cartFilePath = 'carrito.json'; 

cartRouter.post('/', (req, res) => {
  
});

cartRouter.get('/:cid', (req, res) => {
 
});

cartRouter.post('/:cid/product/:pid', (req, res) => {
 
});

module.exports = cartRouter;