import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Search, MapPin, Mail, Phone } from 'lucide-react';

const EmployeeDirectory = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get('http://localhost:5000/api/employees', config);
        setEmployees(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, [user]);

  // Filter logic
  const filteredEmployees = employees.filter((emp) =>
    emp.userId.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="text-center mt-10">Loading Directory...</div>;

  return (
    <div>
      {/* Page Header & Search */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gts-primary">Employee Directory</h2>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search employees..."
            className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gts-accent"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Grid of Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEmployees.map((emp) => (
          <div key={emp._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 rounded-full bg-gts-surface text-gts-primary flex items-center justify-center font-bold text-lg">
                {emp.userId.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-gts-primary">{emp.userId.name}</h3>
                <p className="text-sm text-gts-muted">{emp.designation}</p>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <span className="w-4 h-4 mr-2 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-600">#</span>
                {emp.employeeId}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Mail size={14} className="mr-2 text-gts-accent" />
                {emp.userId.email}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs">
                  {emp.department}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeeDirectory;