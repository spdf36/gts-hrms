import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminLeaveList = () => {
    const { user } = useAuth();
    const [leaves, setLeaves] = useState([]);

    useEffect(() => {
        fetchLeaves();
    }, []);

    const fetchLeaves = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get('http://localhost:5000/api/leaves', config);
            setLeaves(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.put(`http://localhost:5000/api/leaves/${id}/status`, { status: newStatus }, config);
            toast.success(`Request ${newStatus}`);
            fetchLeaves(); // Refresh UI
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    return (
        <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-gts-primary mb-6">Leave Requests</h2>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                        <tr>
                            <th className="p-4">Employee</th>
                            <th className="p-4">Type</th>
                            <th className="p-4">Dates</th>
                            <th className="p-4">Reason</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {leaves.map((leave) => (
                            <tr key={leave._id} className="hover:bg-gray-50">
                                <td className="p-4 font-bold text-gts-primary">{leave.userId?.name || 'Unknown'}</td>
                                <td className="p-4">{leave.leaveType}</td>
                                <td className="p-4 text-sm text-gray-600">
                                    {new Date(leave.startDate).toLocaleDateString()} - <br/>
                                    {new Date(leave.endDate).toLocaleDateString()}
                                </td>
                                <td className="p-4 text-sm text-gray-500 max-w-xs truncate">{leave.reason}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold 
                                        ${leave.status === 'Approved' ? 'bg-green-100 text-green-700' : 
                                          leave.status === 'Rejected' ? 'bg-red-100 text-red-700' : 
                                          'bg-yellow-100 text-yellow-700'}`}>
                                        {leave.status}
                                    </span>
                                </td>
                                <td className="p-4 text-right space-x-2">
                                    {leave.status === 'Pending' && (
                                        <>
                                            <button 
                                                onClick={() => handleStatusUpdate(leave._id, 'Approved')}
                                                className="text-green-500 hover:text-green-700 transition-colors"
                                                title="Approve"
                                            >
                                                <CheckCircle size={20} />
                                            </button>
                                            <button 
                                                onClick={() => handleStatusUpdate(leave._id, 'Rejected')}
                                                className="text-red-500 hover:text-red-700 transition-colors"
                                                title="Reject"
                                            >
                                                <XCircle size={20} />
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {leaves.length === 0 && <div className="p-8 text-center text-gray-400">No leave requests found.</div>}
            </div>
        </div>
    );
};

export default AdminLeaveList;