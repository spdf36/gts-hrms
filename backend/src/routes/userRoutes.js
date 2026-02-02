const express = require('express');
const router = express.Router();

// Import Controllers
const { authUser } = require('../controllers/authController');
const { 
    createUser, 
    getUsers, 
    resetPassword, 
    deleteUser 
} = require('../controllers/adminController');

// Import Middleware
const { protect, admin } = require('../middleware/authMiddleware');

// --- PUBLIC ROUTES ---
router.post('/login', authUser);
// router.post('/register', registerUser); // Disabled: Only Admins create users now

// --- ADMIN ROUTES ---

// 1. User Management (Create & List)
router.route('/')
    .post(protect, admin, createUser)   // Create new user + employee profile
    .get(protect, admin, getUsers);     // Get all users

// 2. Specific User Operations (Delete & Reset Password)
router.route('/:id')
    .delete(protect, admin, deleteUser); // Delete user

router.put('/:id/password', protect, admin, resetPassword); // Reset password

module.exports = router;