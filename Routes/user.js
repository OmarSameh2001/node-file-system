// Internal Modules
const userController = require('../controllers/user');

// 3rd Party Modules
const express = require('express');

// Declarations
const router = express.Router();

// multer
const {createUserFiles} = require('../middleware/multer');

//---------------------------------------------------// Page Break

// Create new User
router.post('/', createUserFiles, employeeController.create);

module.exports = router;
