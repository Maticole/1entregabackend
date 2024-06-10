const express = require('express');
const UserController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

const multer = require('multer');
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

router.use(authController.protect); 

router.get('/', authController.restrictTo('admin'), UserController.getAllUsers);

router.delete('/', authController.restrictTo('admin'), UserController.deleteInactiveUsers);

router.post('/:uid/documents', UserController.updateLastConnection, upload.array('documents'), UserController.uploadDocuments);

router.patch('/premium/:uid',
  authController.restrictTo('admin'),
  UserController.changeUserRole
);

module.exports = router;