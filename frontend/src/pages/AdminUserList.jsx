import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Plus, Trash2 } from 'lucide-react';

const AdminUserList = () => {
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    
    // Form State
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', role: 'employee', 
        employeeId: '', department: '', designation: ''
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get('http://localhost:5000/api/users', config);
            setUsers(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post('http://localhost:5000/api/users', formData, config);
            toast.success('User Created Successfully');
            setShowModal(false);
            fetchUsers(); // Refresh the list
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed');
        }
    };

    const handleResetPassword = async (id) => {
        const newPassword = prompt("Enter new password for this user:");
        if (!newPassword) return;

        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.put(`http://localhost:5000/api/users/${id}/password`, { password: newPassword }, config);
            toast.success('Password Reset Successfully');
        } catch (error) {
            toast.error('Failed to reset password');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this user? This cannot be undone.')) {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                await axios.delete(`http://localhost:5000/api/users/${id}`, config);
                toast.success('User Deleted');
                fetchUsers(); // Refresh the list
            } catch (error) {
                toast.error('Failed to delete user');
            }
        }
    };

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gts-primary">System Users</h2>
                <button 
                    onClick={() => setShowModal(true)}
                    className="bg-gts-accent text-white px-4 py-2 rounded-lg flex items-center hover:bg-gts-secondary"
                >
                    <Plus size={18} className="mr-2"/> Add New User
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                        <tr>
                            <th className="p-4">Name</th>
                            <th className="p-4">Email</th>
                            <th className="p-4">Role</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {users.map((u) => (
                            <tr key={u._id} className="hover:bg-gray-50">
                                <td className="p-4 font-medium">{u.name}</td>
                                <td className="p-4 text-gray-600">{u.email}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                        {u.role}
                                    </span>
                                </td>
                                <td className="p-4 text-right space-x-2">
                                    <button 
                                        onClick={() => handleResetPassword(u._id)}
                                        className="text-gts-accent hover:text-gts-primary text-sm font-medium mr-2"
                                        title="Reset Password"
                                    >
                                        Reset Pass
                                    </button>
                                    
                                    <button 
                                        onClick={() => handleDelete(u._id)}
                                        className="text-red-400 hover:text-red-600 transition-colors"
                                        title="Delete User"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal for Creating User */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-lg">
                        <h3 className="text-xl font-bold mb-4">Create New Employee</h3>
                        <form onSubmit={handleCreateUser} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <input placeholder="Full Name" className="border p-2 rounded" required onChange={e => setFormData({...formData, name: e.target.value})} />
                                <input placeholder="Email" className="border p-2 rounded" required type="email" onChange={e => setFormData({...formData, email: e.target.value})} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <input placeholder="Password" className="border p-2 rounded" required type="password" onChange={e => setFormData({...formData, password: e.target.value})} />
                                <select className="border p-2 rounded" onChange={e => setFormData({...formData, role: e.target.value})}>
                                    <option value="employee">Employee</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            
                            <div className="border-t pt-4 mt-2">
                                <p className="text-sm font-bold text-gray-500 mb-2">Profile Details</p>
                                <div className="grid grid-cols-3 gap-2">
                                    <input placeholder="GTS-XXX" className="border p-2 rounded" required onChange={e => setFormData({...formData, employeeId: e.target.value})} />
                                    <input placeholder="Department" className="border p-2 rounded" required onChange={e => setFormData({...formData, department: e.target.value})} />
                                    <input placeholder="Designation" className="border p-2 rounded" required onChange={e => setFormData({...formData, designation: e.target.value})} />
                                </div>
                            </div>

                            <div className="flex justify-end space-x-2 mt-6">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-500 hover:text-gray-700">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-gts-primary text-white rounded hover:bg-gts-secondary">Create User</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUserList;