import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Clock, CheckCircle, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';

const AttendanceWidget = () => {
    const { user } = useAuth();
    const [status, setStatus] = useState(null); // 'in', 'out', or null (not started)
    const [attendance, setAttendance] = useState(null);
    const [loading, setLoading] = useState(false);

    // Fetch Status on Load
    useEffect(() => {
        fetchStatus();
    }, []);

    const fetchStatus = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get('http://localhost:5000/api/attendance/status', config);
            
            if (data) {
                setAttendance(data);
                if (data.clockOut) setStatus('completed');
                else setStatus('working');
            } else {
                setStatus('not_started');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleClockIn = async () => {
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post('http://localhost:5000/api/attendance/clock-in', {}, config);
            toast.success('Clocked In Successfully!');
            fetchStatus(); // Refresh UI
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error');
        } finally {
            setLoading(false);
        }
    };

    const handleClockOut = async () => {
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.put('http://localhost:5000/api/attendance/clock-out', {}, config);
            toast.success('Clocked Out. Good job!');
            fetchStatus();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
            <h3 className="text-lg font-bold text-gts-primary mb-4 flex items-center">
                <Clock className="mr-2" size={20} /> Today's Attendance
            </h3>

            <div className="flex flex-col items-center justify-center py-4">
                {status === 'not_started' && (
                    <>
                        <p className="text-gray-500 mb-4">You haven't clocked in yet.</p>
                        <button 
                            onClick={handleClockIn}
                            disabled={loading}
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-bold w-full transition-colors flex items-center justify-center"
                        >
                            Clock In Now
                        </button>
                    </>
                )}

                {status === 'working' && (
                    <>
                        <div className="text-center mb-6">
                            <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full uppercase tracking-wide">
                                Currently Working
                            </span>
                            <p className="text-3xl font-mono text-gray-800 mt-2">
                                {new Date(attendance.clockIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                            <p className="text-xs text-gray-400">Started at</p>
                        </div>
                        <button 
                            onClick={handleClockOut}
                            disabled={loading}
                            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-bold w-full transition-colors flex items-center justify-center"
                        >
                            <LogOut className="mr-2" size={18} /> Clock Out
                        </button>
                    </>
                )}

                {status === 'completed' && (
                    <div className="text-center">
                        <CheckCircle size={48} className="text-green-500 mx-auto mb-2" />
                        <h4 className="text-xl font-bold text-gray-800">Day Complete!</h4>
                        <p className="text-gray-500 mt-1">
                            Total Hours: <span className="font-bold text-gts-primary">{attendance.totalHours} hrs</span>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AttendanceWidget;