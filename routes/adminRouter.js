const express = require('express');
const Product = require('../dao/models/productSchema');
const { authorizeUser } = require('../utils/authMiddleware');

const adminRouter = express.Router();

adminRouter.get('/admin', authorizeUser(['admin']), async (req, res) => {
    try {
        const productos = await Product.find();
        res.render('admin', { products: productos });
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).send('Error interno del servidor');
    }
});

adminRouter.post('/admin/product', authorizeUser(['admin']), async (req, res) => {
    const { name, description, price } = req.body;
    try {
        const newProduct = new Product({ name, description, price, owner: req.user._id });
        await newProduct.save();
        res.redirect('/admin');
    } catch (error) {
        console.error('Error al agregar producto:', error);
        res.status(500).send('Error interno del servidor');
    }
});

adminRouter.get('/admin/product/:id/edit', authorizeUser(['admin']), async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).send('Producto no encontrado');
        }
        res.render('editProduct', { product });
    } catch (error) {
        console.error('Error al obtener producto:', error);
        res.status(500).send('Error interno del servidor');
    }
});

adminRouter.post('/admin/product/:id', authorizeUser(['admin']), async (req, res) => {
    const { name, description, price } = req.body;
    try {
        await Product.findByIdAndUpdate(req.params.id, { name, description, price });
        res.redirect('/admin');
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        res.status(500).send('Error interno del servidor');
    }
});


adminRouter.delete('/admin/product/:id', authorizeUser(['admin']), async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.redirect('/admin');
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        res.status(500).send('Error interno del servidor');
    }
});

module.exports = adminRouter;