const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

router.patch('/api/users/premium/:uid',
  authController.protect,
  authController.restrictTo('admin'),
  userController.changeUserRole
);

module.exports = router;