// Internal Modules
const employeeController = require('../../../controllers/Accounts/User/employee');

// 3rd Party Modules
const express = require('express');

// Declarations
const router = express.Router();

// multer
const {createEmployee} = require('../../../middleware/multer');

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
