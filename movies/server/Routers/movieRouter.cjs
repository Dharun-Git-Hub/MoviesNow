const express = require('express');
const router = express.Router();
const movieController = require('../Controllers/movieController.cjs');

router.get('/', movieController.getMovies);
router.post('/add', movieController.addMovie);
router.post('/remove', movieController.removeMovie);
router.post('/update', movieController.updateMovie);
router.get('/revenue', movieController.revenueByMovie);
router.get('/whereAreCasting', movieController.whereAreCasting);

module.exports = router;
