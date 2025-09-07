const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const auth = require('../middleware/auth');
const validation = require('../middleware/validation');

router.get('/', auth, transactionController.getTransactions);
router.post('/', auth, validation.validateTransaction, transactionController.createTransaction);
router.get('/summary', auth, transactionController.getSummary);

module.exports = router;