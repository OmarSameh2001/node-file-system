const Multer = require('../clients/MulterClient');
const os = require("os");

const multerService = new Multer();

// Define employeeImage as middleware function
const createEmployee = (req, res, next) => {
  
  // (filePath, fields, filter)
  multerService.upload(
    '/employees/images/', // should be temporary like (os.tmpdir())
    [
      { name: 'photo', maxCount: 1 },
      { name: 'id', maxCount: 10 },
    ],
    ['image/', 'application/']
  )(req, res, err => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
};
const createCustomer = (req, res, next) => {
  
  // (filePath, fields, filter)
  multerService.upload(
    '/customers/images/', // should be temporary like (os.tmpdir())
    [
      { name: 'photo', maxCount: 1 },
      { name: 'requests', maxCount: 10 },
    ],
    ['image/', 'application/']
  )(req, res, err => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
};
const createOrganization = (req, res, next) => {
  
  // (filePath, fields, filter)
  multerService.upload(
    '/organizations/images/', // should be temporary like (os.tmpdir())
    [
      { name: 'photo', maxCount: 1 },
      { name: 'requests', maxCount: 10 },
    ],
    ['image/', 'application/']
  )(req, res, err => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
};

module.exports = {createEmployee , createOrganization, createCustomer};