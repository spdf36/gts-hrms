import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Clock, ChevronLeft, ChevronRight, User, Filter, AlertCircle } from 'lucide-react';
import { format, subMonths, addMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, getDay, parseISO } from 'date-fns';

const AdminAttendance = () => {
    const { user } = useAuth();
    
    // State
    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState('');
    const [viewDate, setViewDate] = useState(new Date());
    const [loading, setLoading] = useState(false);

    // Data for the selected user
    const [attendance, setAttendance] = useState([]);
    const [leaves, setLeaves] = useState([]);
    const [holidays, setHolidays] = useState([]);

    // 1. Fetch User List on Mount
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get('http://localhost:5000/api/users', config);
                setUsers(data);
                if(data.length > 0) setSelectedUserId(data[0]._id); // Select first user by default
            } catch (error) {
                console.error("Failed to fetch users", error);
            }
        };
        fetchUsers();
        fetchHolidays(); // Fetch global holidays once
    }, []);

    // 2. Fetch User Data when User or Date changes
    useEffect(() => {
        if (selectedUserId) {
            fetchUserData(selectedUserId);
        }
    }, [selectedUserId, viewDate]);

    const fetchHolidays = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get('http://localhost:5000/api/holidays', config);
            setHolidays(data);
        } catch (error) { console.error(error); }
    };

    const fetchUserData = async (userId) => {
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            
            // Fetch Attendance for User & ALL Leaves (then filter)
            // Note: Optimally we would have a specific getLeavesByUser endpoint, but filtering getAllLeaves works for now
            const [attRes, leaveRes] = await Promise.all([
                axios.get(`http://localhost:5000/api/attendance/user/${userId}`, config),
                axios.get('http://localhost:5000/api/leaves', config) // Admin gets all leaves
            ]);

            setAttendance(attRes.data);
            
            // Filter leaves for this specific user only
            const userLeaves = leaveRes.data.filter(l => l.userId._id === userId || l.userId === userId);
            setLeaves(userLeaves);

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // --- NAVIGATION ---
    const handlePrevMonth = () => setViewDate(subMonths(viewDate, 1));
    const handleNextMonth = () => setViewDate(addMonths(viewDate, 1));

    // --- GENERATE TABLE DATA ---
    const daysInView = eachDayOfInterval({
        start: startOfMonth(viewDate),
        end: endOfMonth(viewDate)
    });

    const timesheet = daysInView.map((date) => {
        // A. Holiday
        const holiday = holidays.find(h => isSameDay(parseISO(h.date), date));
        if (holiday) return { date, status: 'Holiday', label: holiday.name, color: 'bg-purple-100 text-purple-700' };

        // B. Weekend
        if (getDay(date) === 0) return { date, status: 'Weekend', label: 'Sunday', color: 'bg-gray-100 text-gray-500' };

        // C. Leave (Approved)
        const leave = leaves.find(l => 
            l.status === 'Approved' && 
            date >= parseISO(l.startDate) && 
            date <= parseISO(l.endDate)
        );
        if (leave) return { date, status: 'Leave', label: leave.leaveType, color: 'bg-red-100 text-red-700' };

        // D. Attendance
        const workLog = attendance.find(a => isSameDay(parseISO(a.date), date));
        if (workLog) return { 
            date, status: 'Present', label: 'Worked', color: 'bg-green-100 text-green-700',
            clockIn: workLog.clockIn, clockOut: workLog.clockOut, totalHours: workLog.totalHours
        };

        // E. Absent / Empty
        const isTodayOrFuture = date >= new Date().setHours(0,0,0,0);
        return { 
            date, 
            status: isTodayOrFuture ? '-' : 'Absent', 
            label: isTodayOrFuture ? '' : 'Unexcused', 
            color: isTodayOrFuture ? 'text-gray-400' : 'bg-red-50 text-red-500 font-bold' 
        };
    });

    // Stats for the selected view
    const stats = {
        present: timesheet.filter(d => d.status === 'Present').length,
        leaves: timesheet.filter(d => d.status === 'Leave').length,
        absent: timesheet.filter(d => d.status === 'Absent').length
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold text-gts-primary flex items-center">
                <Filter className="mr-2" /> Employee Attendance Audit
            </h2>

            {/* --- CONTROLS --- */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
                
                {/* 1. User Selector */}
                <div className="w-full md:w-1/3">
                    <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Select Employee</label>
                    <div className="relative">
                        <select 
                            className="w-full border border-gray-300 rounded-lg p-3 pl-10 appearance-none focus:ring-2 focus:ring-gts-primary outline-none bg-white font-medium"
                            value={selectedUserId}
                            onChange={(e) => setSelectedUserId(e.target.value)}
                        >
                            {users.map(u => (
                                <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
                            ))}
                        </select>
                        <User className="absolute left-3 top-3.5 text-gray-400" size={18}/>
                    </div>
                </div>

                {/* 2. Month Navigator */}
                <div className="flex items-center bg-gray-50 rounded-lg p-1">
                    <button onClick={handlePrevMonth} className="p-2 hover:bg-white hover:shadow-sm rounded-md transition-all text-gray-600"><ChevronLeft size={20} /></button>
                    <span className="px-6 font-bold text-lg text-gray-800 min-w-[160px] text-center">{format(viewDate, 'MMMM yyyy')}</span>
                    <button onClick={handleNextMonth} className="p-2 hover:bg-white hover:shadow-sm rounded-md transition-all text-gray-600"><ChevronRight size={20} /></button>
                </div>

                {/* 3. Quick Stats */}
                <div className="flex space-x-4 text-sm">
                    <div className="text-center px-2">
                        <span className="block text-xs font-bold text-gray-400">PRESENT</span>
                        <span className="text-xl font-bold text-green-600">{stats.present}</span>
                    </div>
                    <div className="text-center px-2 border-l border-gray-200">
                        <span className="block text-xs font-bold text-gray-400">LEAVES</span>
                        <span className="text-xl font-bold text-blue-600">{stats.leaves}</span>
                    </div>
                    <div className="text-center px-2 border-l border-gray-200">
                        <span className="block text-xs font-bold text-gray-400">ABSENT</span>
                        <span className="text-xl font-bold text-red-500">{stats.absent}</span>
                    </div>
                </div>
            </div>

            {/* --- TABLE --- */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                        <tr>
                            <th className="p-4 w-1/4">Date</th>
                            <th className="p-4 w-1/4">Status</th>
                            <th className="p-4">Time Logs</th>
                            <th className="p-4 text-right">Hours</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {loading ? (
                             <tr><td colSpan="4" className="p-12 text-center text-gray-400">Loading user data...</td></tr>
                        ) : (
                            timesheet.map((day) => (
                                <tr key={day.date.toString()} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 font-medium flex items-center text-gray-700">
                                        <span className={`w-8 text-center font-bold mr-3 ${day.status === 'Weekend' ? 'text-red-400' : 'text-gray-500'}`}>
                                            {format(day.date, 'dd')}
                                        </span>
                                        <span className="text-gray-500 text-sm">{format(day.date, 'EEEE')}</span>
                                    </td>
                                    
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${day.color}`}>
                                            {day.status}
                                        </span>
                                        {day.label && day.status !== 'Present' && (
                                            <span className="text-[10px] text-gray-400 ml-2">{day.label}</span>
                                        )}
                                    </td>

                                    <td className="p-4 text-gray-600 text-sm">
                                        {day.status === 'Present' ? (
                                            <div className="flex items-center space-x-3 font-mono text-xs">
                                                <span className="bg-green-50 px-2 py-1 rounded text-green-700">
                                                    IN: {format(parseISO(day.clockIn), 'hh:mm a')}
                                                </span>
                                                {day.clockOut ? (
                                                    <span className="bg-gray-50 px-2 py-1 rounded text-gray-600">
                                                        OUT: {format(parseISO(day.clockOut), 'hh:mm a')}
                                                    </span>
                                                ) : (
                                                    <span className="text-orange-500 font-bold animate-pulse">Active</span>
                                                )}
                                            </div>
                                        ) : '-'}
                                    </td>

                                    <td className="p-4 text-right font-bold text-gray-800">
                                        {day.totalHours ? `${day.totalHours}h` : '-'}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminAttendance;