const express = require('express');
const router = express.Router();
const queryController = require('../Controllers/queryController.cjs');

router.post('/place', queryController.placeQuery);
router.get('/getQueries', queryController.getQueries);
router.patch('/setResolved', queryController.setResolved);

module.exports = router;