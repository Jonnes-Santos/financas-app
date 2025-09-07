const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const validation = require('../middleware/validation');

router.post('/register', validation.validateRegister, authController.register);
router.post('/login', authController.login);

module.exports = router;