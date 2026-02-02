import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Trash2, Plus, Sun } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminHolidays = () => {
    const { user } = useAuth();
    const [holidays, setHolidays] = useState([]);
    const [form, setForm] = useState({ date: '', name: '' });

    useEffect(() => { fetchHolidays(); }, []);

    const fetchHolidays = async () => {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get('http://localhost:5000/api/holidays', config);
        setHolidays(data);
    };

    const addHoliday = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post('http://localhost:5000/api/holidays', form, config);
            toast.success('Holiday Added');
            setForm({ date: '', name: '' });
            fetchHolidays();
        } catch (error) {
            toast.error('Failed to add holiday');
        }
    };

    const deleteHoliday = async (id) => {
        if(!window.confirm('Delete this holiday?')) return;
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.delete(`http://localhost:5000/api/holidays/${id}`, config);
            toast.success('Holiday Deleted');
            fetchHolidays();
        } catch (error) {
            toast.error('Failed to delete');
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold text-gts-primary flex items-center">
                <Sun className="mr-2"/> Holiday Management
            </h2>

            {/* Add Form */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <form onSubmit={addHoliday} className="flex gap-4 items-end">
                    <div className="flex-1">
                        <label className="text-sm font-bold text-gray-700">Date</label>
                        <input required type="date" className="w-full border p-2 rounded" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
                    </div>
                    <div className="flex-[2]">
                        <label className="text-sm font-bold text-gray-700">Holiday Name</label>
                        <input required placeholder="e.g. Diwali" className="w-full border p-2 rounded" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                    </div>
                    <button type="submit" className="bg-gts-primary text-white px-6 py-2 rounded font-bold hover:bg-gts-secondary">Add</button>
                </form>
            </div>

            {/* List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                        <tr>
                            <th className="p-4">Date</th>
                            <th className="p-4">Occasion</th>
                            <th className="p-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {holidays.map(h => (
                            <tr key={h._id}>
                                <td className="p-4">{h.date}</td>
                                <td className="p-4 font-bold text-gray-700">{h.name}</td>
                                <td className="p-4 text-right">
                                    <button onClick={() => deleteHoliday(h._id)} className="text-red-400 hover:text-red-600"><Trash2 size={18} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminHolidays;