const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    date: { 
        type: String, // Format: "YYYY-MM-DD" (Makes it easy to query "today")
        required: true 
    },
    clockIn: { type: Date },
    clockOut: { type: Date },
    totalHours: { type: Number, default: 0 }, // Calculated on ClockOut
    status: { 
        type: String, 
        enum: ['Present', 'Absent', 'Half Day', 'Late'],
        default: 'Present' 
    }
}, { timestamps: true });

// Prevent duplicate entries for the same user on the same day
attendanceSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);