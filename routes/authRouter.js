const express = require('express');
const authController = require('../controllers/authController');
const UserDTO = require('../dto/UserDTO'); 
const authRouter = express.Router();

authRouter.get('/current', authController.getCurrentUserDTO); 
authRouter.post('/reset-password', authController.resetPassword); 
authRouter.post('/update-password', authController.updatePassword); 

module.exports = authRouter;