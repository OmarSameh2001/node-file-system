// Internal Modules
const userController = require('../controllers/user');

// 3rd Party Modules
const express = require('express');

// Declarations
const router = express.Router();

// multer
const {createUserFiles} = require('../../../middleware/multer');

//---------------------------------------------------// Page Break

// Create new User
router.post('/', createEmployee, employeeController.create);

// Get all Users
router.get('/', employeeController.get);

// Update User by Id
router.put(
  '/:id',
  employeeController.updateById,
);

// get the files
router.get('/document/:filename', employeeController.getFileByName);

module.exports = router;
