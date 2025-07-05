const express = require('express');
const router = express.Router();
const theatreController = require('../Controllers/theatreController.cjs');

router.get('/', theatreController.getTheatres);
router.post('/add', theatreController.addTheatre);
router.post('/remove', theatreController.removeTheatre);
router.put('/update', theatreController.updateTheatre);
router.get('/noOfTheatres', theatreController.noOfTheatres);
router.get('/revenue', theatreController.revenueByTheatre);

module.exports = router;
