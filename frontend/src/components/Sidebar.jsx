import { LayoutDashboard, UserCircle, Users, LogOut, Shield, Calendar, Clock, Sun, CalendarDays } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ClipboardList } from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();

  const navItemClass = ({ isActive }) =>
    `flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200 ${
      isActive ? 'bg-gts-accent text-white' : 'text-gray-300 hover:bg-gts-secondary hover:text-white'
    }`;

  return (
    <div className="h-screen w-64 bg-gts-primary text-white flex flex-col fixed left-0 top-0 shadow-xl overflow-y-auto z-50">
      {/* Brand Logo */}
      <div className="h-16 flex items-center justify-center border-b border-gts-secondary shrink-0">
        <h1 className="text-2xl font-bold tracking-wider">GTS <span className="font-light">HRMS</span></h1>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        <NavLink to="/" className={navItemClass}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/calendar" className={navItemClass}>
          <CalendarDays size={20} />
          <span>Company Calendar</span>
        </NavLink>

        <NavLink to="/attendance" className={navItemClass}>
          <Clock size={20} />
          <span>My Attendance</span>
        </NavLink>

        <NavLink to="/leaves" className={navItemClass}>
          <Calendar size={20} />
          <span>Leave Management</span>
        </NavLink>

        <NavLink to="/profile" className={navItemClass}>
          <UserCircle size={20} />
          <span>My Profile</span>
        </NavLink>

        {/* Admin Only Section */}
        {user?.role === 'admin' && (
          <>
            <div className="pt-4 pb-2">
              <p className="text-xs font-bold text-gray-500 uppercase px-3">Admin Controls</p>
            </div>
            
            <NavLink to="/admin/leaves" className={navItemClass}>
              <Calendar size={20} />
              <span>Leave Approvals</span>
            </NavLink>

            <NavLink to="/admin/holidays" className={navItemClass}>
              <Sun size={20} />
              <span>Holiday Management</span>
            </NavLink>

            <NavLink to="/directory" className={navItemClass}>
              <Users size={20} />
              <span>Directory</span>
            </NavLink>

            <NavLink to="/admin/users" className={navItemClass}>
              <Shield size={20} />
              <span>User Management</span>
            </NavLink>

            <NavLink to="/admin/attendance" className={navItemClass}>
    <ClipboardList size={20} />
    <span>All Attendance</span>
</NavLink>

          </>

        )}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gts-secondary shrink-0">
        <button
          onClick={logout}
          className="flex items-center space-x-3 text-gray-300 hover:text-red-400 transition-colors w-full p-2"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;