const User = require('../models/User');
const Employee = require('../models/Employee');
const bcrypt = require('bcryptjs');

// @desc    Create a new User + Employee Profile
// @route   POST /api/users
const createUser = async (req, res) => {
    try {
        const { name, email, password, role, employeeId, department, designation } = req.body;

        // 1. Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // 2. Create User (Login Auth)
        // Note: Password will be hashed automatically by your User model 'pre save' hook
        const user = await User.create({
            name,
            email,
            password, 
            role
        });

        // 3. Create Linked Employee Profile (HR Data)
        const employee = await Employee.create({
            userId: user._id,
            employeeId, // e.g., "GTS-005"
            department,
            designation,
            salary: 0, // Default to 0, update later
            status: 'active'
        });

        res.status(201).json({ message: 'User and Profile Created', user, employee });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Admin Reset Password
// @route   PUT /api/users/:id/password
const resetPassword = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            user.password = req.body.password; // Model hook will hash this
            await user.save();
            res.json({ message: 'Password updated successfully' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get List of Users (for Admin Table)
// @route   GET /api/users
const getUsers = async (req, res) => {
    try {
        // Fetch all users but hide their passwords
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createUser, resetPassword, getUsers };