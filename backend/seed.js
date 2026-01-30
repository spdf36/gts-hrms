const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');
const Employee = require('./src/models/Employee');
const connectDB = require('./src/config/db');

dotenv.config();
connectDB();

const importData = async () => {
  try {
    // 1. CLEAR EXISTING DATA
    await User.deleteMany();
    await Employee.deleteMany();
    console.log('Data Destroyed...');

    // 2. CREATE USERS (Login Info)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const users = await User.insertMany([
      { name: 'Admin User', email: 'admin@gts.ai', password: hashedPassword, role: 'admin' },
      { name: 'John Doe', email: 'john@gts.ai', password: hashedPassword, role: 'employee' },
      { name: 'Jane Smith', email: 'jane@gts.ai', password: hashedPassword, role: 'employee' },
      { name: 'Mike Johnson', email: 'mike@gts.ai', password: hashedPassword, role: 'employee' },
    ]);

    // 3. CREATE EMPLOYEES (HR Info) - Linked to Users
    const employees = [
      {
        userId: users[0]._id,
        employeeId: 'GTS-001',
        department: 'Administration',
        designation: 'System Administrator',
        salary: 100000,
        status: 'active'
      },
      {
        userId: users[1]._id,
        employeeId: 'GTS-002',
        department: 'Engineering',
        designation: 'Frontend Developer',
        salary: 75000,
        status: 'active'
      },
      {
        userId: users[2]._id,
        employeeId: 'GTS-003',
        department: 'HR',
        designation: 'HR Manager',
        salary: 80000,
        status: 'active'
      },
      {
        userId: users[3]._id,
        employeeId: 'GTS-004',
        department: 'Marketing',
        designation: 'Content Strategist',
        salary: 60000,
        status: 'probation'
      },
    ];

    await Employee.insertMany(employees);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

importData();