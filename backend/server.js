const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./src/config/db');

// IMPORT ROUTES HERE
const userRoutes = require('./src/routes/userRoutes'); 
const employeeRoutes = require('./src/routes/employeeRoutes');
const attendanceRoutes = require('./src/routes/attendanceRoutes');
const leaveRoutes = require('./src/routes/leaveRoutes');
const holidayRoutes = require('./src/routes/holidayRoutes');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// USE ROUTES HERE
app.use('/api/users', userRoutes); 
app.use('/api/employees', employeeRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/holidays', holidayRoutes);

app.get('/', (req, res) => {
    res.send('GTS HRMS API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});