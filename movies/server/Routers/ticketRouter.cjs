const express = require('express');
const router = express.Router();
const ticketController = require('../Controllers/ticketController.cjs');

router.post('/book', ticketController.book);
router.post('/history', ticketController.history);
router.get('/revenueByUser', ticketController.revenueByUser);
router.post('/getCasters', ticketController.getCasters);

module.exports = router;
