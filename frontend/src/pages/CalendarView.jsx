import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { ChevronLeft, ChevronRight, Briefcase, Sun, Clock } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isWeekend, getDay } from 'date-fns';

const CalendarView = () => {
    const { user } = useAuth();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [attendance, setAttendance] = useState([]);
    const [leaves, setLeaves] = useState([]);
    const [holidays, setHolidays] = useState([]);
    const [stats, setStats] = useState({ present: 0, leaves: 0, holidays: 0 });

    useEffect(() => {
        fetchData();
    }, []); // Initial load

    const fetchData = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            
            const [attRes, leaveRes, holidayRes] = await Promise.all([
                axios.get('http://localhost:5000/api/attendance/me', config),
                axios.get('http://localhost:5000/api/leaves/me', config),
                axios.get('http://localhost:5000/api/holidays', config)
            ]);

            setAttendance(attRes.data);
            setLeaves(leaveRes.data);
            setHolidays(holidayRes.data);
            
            // Calculate Stats (Basic)
            setStats({
                present: attRes.data.length,
                leaves: leaveRes.data.filter(l => l.status === 'Approved').length,
                holidays: holidayRes.data.length
            });

        } catch (error) {
            console.error(error);
        }
    };

    // --- CALENDAR LOGIC ---
    const daysInMonth = eachDayOfInterval({
        start: startOfMonth(currentDate),
        end: endOfMonth(currentDate)
    });

    const getDayStatus = (date) => {
        // 1. Check Holiday
        const holiday = holidays.find(h => isSameDay(new Date(h.date), date));
        if (holiday) return { type: 'Holiday', label: holiday.name, color: 'bg-purple-100 text-purple-700' };

        // 2. Check Leave
        const leave = leaves.find(l => 
            l.status === 'Approved' && 
            date >= new Date(l.startDate) && 
            date <= new Date(l.endDate)
        );
        if (leave) return { type: 'Leave', label: leave.leaveType, color: 'bg-red-100 text-red-700' };

        // 3. Check Attendance
        const workDay = attendance.find(a => isSameDay(new Date(a.date), date));
        if (workDay) return { 
            type: 'Present', 
            label: `Worked: ${workDay.totalHours || 0} hrs`, 
            color: 'bg-green-100 text-green-700' 
        };

        // 4. Weekend
        if (getDay(date) === 0) return { type: 'Holiday', label: 'Sunday', color: 'bg-gray-100 text-gray-400' };
        return null; // Absent or Future
    };

    // Helper to shift months
    const changeMonth = (dir) => {
        setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + dir)));
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            
            {/* Header & Controls */}
            <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center space-x-4">
                    <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-gray-100 rounded-full"><ChevronLeft /></button>
                    <h2 className="text-2xl font-bold text-gts-primary">{format(currentDate, 'MMMM yyyy')}</h2>
                    <button onClick={() => changeMonth(1)} className="p-2 hover:bg-gray-100 rounded-full"><ChevronRight /></button>
                </div>

                {/* Mini Stats */}
                <div className="flex space-x-6 mt-4 md:mt-0">
                    <div className="text-center">
                        <p className="text-xs text-gray-400 uppercase">Present</p>
                        <p className="font-bold text-green-600 text-xl">{stats.present}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-xs text-gray-400 uppercase">Holidays</p>
                        <p className="font-bold text-purple-600 text-xl">{stats.holidays}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-xs text-gray-400 uppercase">Leaves</p>
                        <p className="font-bold text-red-500 text-xl">{stats.leaves}</p>
                    </div>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Day Headers (Sun, Mon, Tue...) */}
                <div className="grid grid-cols-7 bg-gray-50 border-b">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                        <div key={d} className="p-4 text-center text-sm font-bold text-gray-500">{d}</div>
                    ))}
                </div>

                {/* Dates */}
                <div className="grid grid-cols-7 auto-rows-fr">
                    {/* Padding for empty start days */}
                    {Array.from({ length: getDay(startOfMonth(currentDate)) }).map((_, i) => (
                        <div key={`empty-${i}`} className="p-4 border-b border-r bg-gray-50/50"></div>
                    ))}

                    {/* Actual Days */}
                    {daysInMonth.map((date) => {
                        const status = getDayStatus(date);
                        return (
                            <div key={date.toString()} className={`min-h-[100px] p-2 border-b border-r hover:bg-gray-50 transition-colors flex flex-col justify-between ${status?.color || ''}`}>
                                <span className={`text-sm font-bold ${isSameDay(date, new Date()) ? 'bg-gts-primary text-white w-6 h-6 rounded-full flex items-center justify-center' : 'text-gray-700'}`}>
                                    {format(date, 'd')}
                                </span>
                                
                                {status && (
                                    <div className="mt-1">
                                        <span className="text-xs font-semibold block truncate">
                                            {status.type}
                                        </span>
                                        <span className="text-[10px] opacity-80 block truncate">
                                            {status.label}
                                        </span>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default CalendarView;