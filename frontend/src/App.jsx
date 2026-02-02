import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

// Layouts & Pages
import Login from './pages/Login';
import DashboardLayout from './layouts/DashboardLayout';
import Profile from './pages/Profile';
import EmployeeDirectory from './pages/EmployeeDirectory';
import AttendanceWidget from './components/AttendanceWidget';
import AttendanceHistory from './pages/AttendanceHistory';
import Leaves from './pages/Leaves';
import CalendarView from './pages/CalendarView'; // <--- NEW IMPORT

// Admin Pages
import AdminUserList from './pages/AdminUserList';
import AdminLeaveList from './pages/AdminLeaveList';
import AdminHolidays from './pages/AdminHolidays'; // <--- NEW IMPORT
import AdminAttendance from './pages/AdminAttendance';

// Protected Route Wrapper
const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<Login />} />

          {/* Protected Routes wrapped in Dashboard Layout */}
          <Route element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
             
             {/* Dashboard Home */}
             <Route path="/" element={
               <div className="space-y-6">
                 <div className="bg-gts-primary text-white p-8 rounded-xl shadow-lg">
                   <h1 className="text-3xl font-bold mb-2">Welcome Back!</h1>
                   <p className="opacity-80">Here is what's happening today at GTS.</p>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   <AttendanceWidget />
                   <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-center text-gray-400 h-64">
                     Leave Balance (Coming Soon)
                   </div>
                   <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-center text-gray-400 h-64">
                     Team Performance (Coming Soon)
                   </div>
                 </div>
               </div>
             } />

             {/* Employee Pages */}
             <Route path="/profile" element={<Profile />} />
             <Route path="/directory" element={<EmployeeDirectory />} />
             <Route path="/attendance" element={<AttendanceHistory />} />
             <Route path="/leaves" element={<Leaves />} />
             
             {/* --- NEW CALENDAR ROUTE --- */}
             <Route path="/calendar" element={<CalendarView />} />

             {/* Admin Pages */}
             <Route path="/admin/users" element={<AdminUserList />} />
             <Route path="/admin/leaves" element={<AdminLeaveList />} />
             <Route path="/admin/attendance" element={<AdminAttendance />} />
             
             {/* --- NEW HOLIDAY ROUTE --- */}
             <Route path="/admin/holidays" element={<AdminHolidays />} />
             
          </Route>

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;