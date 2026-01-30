import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { User, Mail, Briefcase, MapPin, Phone, Building } from 'lucide-react';

const Profile = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                // We send the token in the header
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                };
                const { data } = await axios.get('http://localhost:5000/api/employees/me', config);
                setProfile(data);
            } catch (error) {
                console.log("Profile not found (Expected for new admins)");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [user]);

    if (loading) return <div className="text-center mt-10">Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gts-primary mb-6">My Profile</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Left Column: Identity Card */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                    <div className="h-24 w-24 bg-gts-secondary rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4">
                        {user.name.charAt(0)}
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">{user.name}</h3>
                    <p className="text-gray-500 mb-4">{profile ? profile.designation : 'N/A'}</p>
                    
                    <div className="w-full border-t pt-4 space-y-3 text-left">
                        <div className="flex items-center text-sm text-gray-600">
                            <Mail size={16} className="mr-3 text-gts-accent" />
                            {user.email}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                            <Building size={16} className="mr-3 text-gts-accent" />
                            {profile ? profile.department : 'No Dept Assigned'}
                        </div>
                    </div>
                </div>

                {/* Right Column: Details */}
                <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-lg text-gts-primary border-b pb-2 mb-4">Employee Details</h3>
                    
                    {profile ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-xs text-gray-400 uppercase">Employee ID</label>
                                <p className="font-medium text-gray-700">{profile.employeeId}</p>
                            </div>
                            <div>
                                <label className="text-xs text-gray-400 uppercase">Joining Date</label>
                                <p className="font-medium text-gray-700">
                                    {new Date(profile.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            <div>
                                <label className="text-xs text-gray-400 uppercase">Status</label>
                                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                                    {profile.status}
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-10 bg-gray-50 rounded-lg">
                            <p className="text-gray-500 mb-2">Profile incomplete.</p>
                            <p className="text-sm text-gray-400">Please ask your Administrator to complete your onboarding.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;