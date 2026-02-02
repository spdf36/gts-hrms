const express = require('express');
const router = express.Router();

// Import Controllers
const { 
    applyLeave, 
    getMyLeaves, 
    getAllLeaves, 
    updateLeaveStatus 
} = require('../controllers/leaveController');

// Import Middleware
const { protect, admin } = require('../middleware/authMiddleware');

// --- EMPLOYEE ROUTES ---
// Apply for a new leave
router.post('/', protect, applyLeave);

// Get my own leave history
router.get('/me', protect, getMyLeaves);

// --- ADMIN ROUTES ---
// Get ALL leave requests (for Admin Dashboard)
router.get('/', protect, admin, getAllLeaves);

// Approve or Reject a leave request
router.put('/:id/status', protect, admin, updateLeaveStatus);

module.exports = router;