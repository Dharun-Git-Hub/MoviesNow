const express = require('express');
const router = express.Router();
const adminController = require('../Controllers/adminController.cjs');

router.post('/adminLogin', adminController.adminLogin);

module.exports = router;
