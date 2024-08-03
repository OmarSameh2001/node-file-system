const Multer = require('../clients/MulterClient');
const os = require("os");

const multerService = new Multer();

// Define employeeImage as middleware function
const createUserFiles = (req, res, next) => {
  
  // (filePath, fields, filter)
  multerService.upload(
    './uploads/user/images/', // could be dynamic {`./uploads/${req.body.name}/images`} or temporary like (os.tmpdir())   
    [
      { name: 'photo', maxCount: 1 },
      { name: 'idFront', maxCount: 1 },
      { name: 'idBack', maxCount: 1},
    ],
    ['image/'] // all image types
  )(req, res, err => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
};

module.exports = {createUserFiles};
