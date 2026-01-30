const express = require('express');
const router = express.Router();
const { registerUser, authUser } = require('../controllers/authController');
const { createUser, resetPassword, getUsers } = require('../controllers/adminController'); // Import new controller
const { protect, admin } = require('../middleware/authMiddleware'); // Import middleware

// Public Routes
router.post('/login', authUser);
// router.post('/register', registerUser); // We can disable public registration now if you want

// Admin Protected Routes
router.route('/')
    .post(protect, admin, createUser)   // Create new employee
    .get(protect, admin, getUsers);     // List all users

router.put('/:id/password', protect, admin, resetPassword); // Reset Password

module.exports = router;