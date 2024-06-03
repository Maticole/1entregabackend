const express = require('express');
const multer = require('multer');
const UserController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

const multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    let dest;
    if (file.fieldname === 'profileImage') {
      dest = 'profiles/';
    } else if (file.fieldname === 'productImage') {
      dest = 'products/';
    } else {
      dest = 'documents/';
    }
    cb(null, dest);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage: multerStorage });


router.post('/:uid/documents', UserController.updateLastConnection, upload.array('documents'), UserController.uploadDocuments);

router.patch('/api/users/premium/:uid',
  authController.protect,
  authController.restrictTo('admin'),
  UserController.changeUserRole
);

module.exports = router;