import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Calendar, CheckCircle, XCircle, Clock, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

const Leaves = () => {
    const { user } = useAuth();
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Form State
    const [formData, setFormData] = useState({
        leaveType: 'Sick Leave',
        startDate: '',
        endDate: '',
        reason: ''
    });

    useEffect(() => {
        fetchLeaves();
    }, []);

    const fetchLeaves = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get('http://localhost:5000/api/leaves/me', config);
            setLeaves(data);
        } catch (error) {
            console.error("Error fetching leaves:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post('http://localhost:5000/api/leaves', formData, config);
            toast.success('Leave Application Submitted');
            
            // Reset form
            setFormData({ leaveType: 'Sick Leave', startDate: '', endDate: '', reason: '' });
            
            // Refresh list immediately
            fetchLeaves(); 
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to submit application');
        }
    };

    const getStatusBadge = (status) => {
        switch(status) {
            case 'Approved': return <span className="flex items-center text-green-700 bg-green-100 px-2 py-1 rounded-full text-xs font-bold"><CheckCircle size={12} className="mr-1"/> Approved</span>;
            case 'Rejected': return <span className="flex items-center text-red-700 bg-red-100 px-2 py-1 rounded-full text-xs font-bold"><XCircle size={12} className="mr-1"/> Rejected</span>;
            default: return <span className="flex items-center text-yellow-700 bg-yellow-100 px-2 py-1 rounded-full text-xs font-bold"><Clock size={12} className="mr-1"/> Pending</span>;
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold text-gts-primary flex items-center">
                <Calendar className="mr-2" /> Leave Management
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                
                {/* ----------------- LEFT: APPLICATION FORM ----------------- */}
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 h-fit">
                    <h3 className="font-bold text-lg mb-4 text-gts-secondary border-b pb-2">Apply for Leave</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-sm font-semibold text-gray-700">Leave Type</label>
                            <select 
                                className="w-full mt-1 border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-gts-accent focus:outline-none"
                                value={formData.leaveType}
                                onChange={(e) => setFormData({...formData, leaveType: e.target.value})}
                            >
                                <option>Sick Leave</option>
                                <option>Casual Leave</option>
                                <option>Paid Leave</option>
                            </select>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-sm font-semibold text-gray-700">Start Date</label>
                                <input 
                                    type="date" 
                                    required
                                    className="w-full mt-1 border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-gts-accent focus:outline-none"
                                    value={formData.startDate}
                                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-gray-700">End Date</label>
                                <input 
                                    type="date" 
                                    required
                                    className="w-full mt-1 border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-gts-accent focus:outline-none"
                                    value={formData.endDate}
                                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-gray-700">Reason</label>
                            <textarea 
                                required
                                rows="3"
                                className="w-full mt-1 border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-gts-accent focus:outline-none"
                                placeholder="Please describe why you need leave..."
                                value={formData.reason}
                                onChange={(e) => setFormData({...formData, reason: e.target.value})}
                            ></textarea>
                        </div>

                        <button 
                            type="submit" 
                            className="w-full bg-gts-primary hover:bg-gts-secondary text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center shadow-md"
                        >
                            <Plus size={18} className="mr-2" /> Submit Request
                        </button>
                    </form>
                </div>

                {/* ----------------- RIGHT: HISTORY TABLE ----------------- */}
                <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                    <h3 className="font-bold text-lg mb-4 text-gts-secondary border-b pb-2">My Leave History</h3>
                    
                    {loading ? (
                        <p className="text-center text-gray-500 py-4">Loading history...</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                                    <tr>
                                        <th className="p-3 border-b">Type</th>
                                        <th className="p-3 border-b">Dates</th>
                                        <th className="p-3 border-b">Reason</th>
                                        <th className="p-3 border-b">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {leaves.map((leave) => (
                                        <tr key={leave._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="p-3 font-medium text-gts-primary">{leave.leaveType}</td>
                                            <td className="p-3 text-sm text-gray-600">
                                                <div className="flex flex-col">
                                                    <span>{new Date(leave.startDate).toLocaleDateString()}</span>
                                                    <span className="text-xs text-gray-400">to</span>
                                                    <span>{new Date(leave.endDate).toLocaleDateString()}</span>
                                                </div>
                                            </td>
                                            <td className="p-3 text-sm text-gray-500 max-w-xs truncate" title={leave.reason}>
                                                {leave.reason}
                                            </td>
                                            <td className="p-3">{getStatusBadge(leave.status)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            
                            {leaves.length === 0 && (
                                <div className="text-center py-10">
                                    <div className="bg-gray-100 rounded-full h-12 w-12 flex items-center justify-center mx-auto mb-3 text-gray-400">
                                        <Calendar size={24} />
                                    </div>
                                    <p className="text-gray-500">No leave requests found.</p>
                                    <p className="text-sm text-gray-400">Use the form to apply for your first leave.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Leaves;