const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Link back to User
    employeeId: { type: String, required: true, unique: true }, // e.g., GTS-001
    department: { type: String, required: true },
    designation: { type: String, required: true },
    salary: { type: Number, required: true }, // Confidential
    status: { 
        type: String, 
        enum: ['active', 'inactive', 'probation'], 
        default: 'probation' 
    },
    // We will add Attendance/Leave references here in Phase 2
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);