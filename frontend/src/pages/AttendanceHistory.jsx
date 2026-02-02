import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Clock, Calendar, ChevronLeft, ChevronRight, Briefcase, Sun, AlertCircle } from 'lucide-react';
import { format, subMonths, addMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, getDay, parseISO } from 'date-fns';

const AttendanceHistory = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [viewDate, setViewDate] = useState(new Date());

    // Data Stores
    const [attendance, setAttendance] = useState([]);
    const [leaves, setLeaves] = useState([]);
    const [holidays, setHolidays] = useState([]);

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            
            // Fetch everything in parallel
            const [attRes, leaveRes, holidayRes] = await Promise.all([
                axios.get('http://localhost:5000/api/attendance/me', config),
                axios.get('http://localhost:5000/api/leaves/me', config),
                axios.get('http://localhost:5000/api/holidays', config)
            ]);

            setAttendance(attRes.data);
            setLeaves(leaveRes.data);
            setHolidays(holidayRes.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // --- NAVIGATION ---
    const handlePrevMonth = () => setViewDate(subMonths(viewDate, 1));
    const handleNextMonth = () => setViewDate(addMonths(viewDate, 1));

    // --- GENERATE MONTHLY TIMESHEET ---
    // 1. Get all days in the currently viewed month
    const daysInView = eachDayOfInterval({
        start: startOfMonth(viewDate),
        end: endOfMonth(viewDate)
    });

    // 2. Map over each day and determine its status
    const timesheet = daysInView.map((date) => {
        // A. Check Holiday
        const holiday = holidays.find(h => isSameDay(parseISO(h.date), date));
        if (holiday) return { date, status: 'Holiday', label: holiday.name, color: 'bg-purple-100 text-purple-700' };

        // B. Check Weekend (Sunday)
        if (getDay(date) === 0) return { date, status: 'Weekend', label: 'Sunday', color: 'bg-gray-100 text-gray-500' };

        // C. Check Leave (Approved)
        const leave = leaves.find(l => 
            l.status === 'Approved' && 
            date >= parseISO(l.startDate) && 
            date <= parseISO(l.endDate)
        );
        if (leave) return { date, status: 'Leave', label: leave.leaveType, color: 'bg-red-100 text-red-700' };

        // D. Check Attendance (Worked)
        const workLog = attendance.find(a => isSameDay(parseISO(a.date), date));
        if (workLog) return { 
            date, 
            status: 'Present', 
            label: 'Worked', 
            color: 'bg-green-100 text-green-700',
            clockIn: workLog.clockIn,
            clockOut: workLog.clockOut,
            totalHours: workLog.totalHours
        };

        // E. Default: Absent / No Data
        // If it's today or future, don't mark as absent yet
        const isTodayOrFuture = date >= new Date().setHours(0,0,0,0);
        return { 
            date, 
            status: isTodayOrFuture ? '-' : 'Absent', 
            label: isTodayOrFuture ? '' : 'No Log', 
            color: isTodayOrFuture ? 'text-gray-400' : 'bg-red-50 text-red-400' 
        };
    });

    // --- CALCULATE STATS ---
    const stats = {
        worked: timesheet.filter(d => d.status === 'Present').length,
        leaves: timesheet.filter(d => d.status === 'Leave').length,
        holidays: timesheet.filter(d => d.status === 'Holiday').length,
        hours: timesheet.reduce((sum, d) => sum + (d.totalHours || 0), 0).toFixed(1)
    };

    if (loading) return <div className="p-12 text-center text-gray-400">Loading timesheet...</div>;

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold text-gts-primary flex items-center">
                <Clock className="mr-2" /> Monthly Timesheet
            </h2>

            {/* --- HEADER CONTROLS --- */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                
                {/* Month Navigator */}
                <div className="flex items-center bg-gray-50 rounded-lg p-1">
                    <button onClick={handlePrevMonth} className="p-2 hover:bg-white hover:shadow-sm rounded-md transition-all text-gray-600"><ChevronLeft size={20} /></button>
                    <span className="px-6 font-bold text-lg text-gray-800 min-w-[160px] text-center">{format(viewDate, 'MMMM yyyy')}</span>
                    <button onClick={handleNextMonth} className="p-2 hover:bg-white hover:shadow-sm rounded-md transition-all text-gray-600"><ChevronRight size={20} /></button>
                </div>

                {/* Expanded Stats */}
                <div className="flex space-x-8 text-sm">
                    <div className="text-center">
                        <span className="text-gray-400 text-xs font-bold uppercase block">Worked</span>
                        <span className="font-bold text-xl text-green-600">{stats.worked}</span>
                    </div>
                    <div className="text-center">
                        <span className="text-gray-400 text-xs font-bold uppercase block">Leaves</span>
                        <span className="font-bold text-xl text-red-500">{stats.leaves}</span>
                    </div>
                    <div className="text-center">
                        <span className="text-gray-400 text-xs font-bold uppercase block">Holidays</span>
                        <span className="font-bold text-xl text-purple-500">{stats.holidays}</span>
                    </div>
                    <div className="text-center border-l pl-8 border-gray-100">
                        <span className="text-gray-400 text-xs font-bold uppercase block">Hours</span>
                        <span className="font-bold text-xl text-gray-800">{stats.hours}</span>
                    </div>
                </div>
            </div>

            {/* --- FULL MONTH TABLE --- */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                        <tr>
                            <th className="p-4 w-1/4">Date</th>
                            <th className="p-4 w-1/4">Status</th>
                            <th className="p-4">Log Details</th>
                            <th className="p-4 text-right">Hours</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {timesheet.map((day) => (
                            <tr key={day.date.toString()} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4 font-medium flex items-center text-gray-700">
                                    <span className={`w-8 text-center font-bold mr-3 ${day.status === 'Weekend' ? 'text-red-400' : 'text-gray-500'}`}>
                                        {format(day.date, 'dd')}
                                    </span>
                                    <span className="text-gray-500 text-sm">
                                        {format(day.date, 'EEEE')}
                                    </span>
                                </td>
                                
                                <td className="p-4">
                                    <div className="flex flex-col">
                                        <span className={`px-2 py-1 w-fit rounded text-xs font-bold uppercase tracking-wider ${day.color}`}>
                                            {day.status}
                                        </span>
                                        {day.label && day.status !== 'Present' && (
                                            <span className="text-[10px] text-gray-400 mt-1 ml-1">{day.label}</span>
                                        )}
                                    </div>
                                </td>

                                <td className="p-4 text-gray-600 text-sm">
                                    {day.status === 'Present' ? (
                                        <div className="flex items-center space-x-4 font-mono text-xs">
                                            <span className="bg-green-50 px-2 py-1 rounded border border-green-100 text-green-700">
                                                IN: {format(parseISO(day.clockIn), 'hh:mm a')}
                                            </span>
                                            {day.clockOut ? (
                                                <span className="bg-gray-50 px-2 py-1 rounded border border-gray-200">
                                                    OUT: {format(parseISO(day.clockOut), 'hh:mm a')}
                                                </span>
                                            ) : (
                                                <span className="text-orange-500 font-bold animate-pulse">Active</span>
                                            )}
                                        </div>
                                    ) : (
                                        <span className="text-gray-300">-</span>
                                    )}
                                </td>

                                <td className="p-4 text-right font-bold text-gray-800">
                                    {day.totalHours ? `${day.totalHours}h` : '-'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AttendanceHistory;