const express = require('express');
const router = express.Router();
// 1. COMBINE IMPORTS HERE (Make sure this is the ONLY line importing from controller)
const { getMyProfile, getAllEmployees } = require('../controllers/employeeController');
const { protect } = require('../middleware/authMiddleware');

// 2. DEFINE ROUTES
router.get('/me', protect, getMyProfile);
router.get('/', protect, getAllEmployees);

module.exports = router;