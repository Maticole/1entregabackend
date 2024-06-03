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

module.exports = upload;