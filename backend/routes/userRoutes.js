const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// POST request untuk sign-up
router.post('/signup', userController.signup);

module.exports = router;