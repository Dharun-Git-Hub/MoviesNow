const express = require('express');
const router = express.Router();
const userController = require('../Controllers/userController.cjs');
const multer = require('multer');
const upload = multer({ dest: 'upload/' });

router.post('/signupEmail', upload.single('image'), userController.signupEmail);
router.post('/validateEmail', userController.validateEmail);
router.post('/validateToken', userController.validateToken);
router.post('/verifyOTP', userController.verifyOTP);
router.post('/getUserDetails', userController.getUserDetails);
router.post('/updateProfile', upload.single('image'), userController.updateProfile);

module.exports = router;
