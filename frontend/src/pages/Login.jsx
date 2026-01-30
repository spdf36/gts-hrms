import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Connect to the Backend we just built
      const { data } = await axios.post('http://localhost:5000/api/users/login', {
        email,
        password,
      });

      login(data); // Save user to context
      toast.success(`Welcome back, ${data.name}!`);
      navigate('/'); // Go to Dashboard
    } catch (error) {
        toast.error(error.response?.data?.message || 'Login Failed');
    }
  };

  return (
    <div className="flex h-screen w-full">
      {/* Left Side - Branding */}
      <div className="hidden w-1/2 bg-gts-primary lg:flex flex-col justify-center items-center text-white p-12">
        <h1 className="text-5xl font-bold mb-4">GTS HRMS</h1>
        <p className="text-xl text-gts-muted">Enterprise Resource Planning</p>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex w-full lg:w-1/2 justify-center items-center bg-white">
        <div className="w-full max-w-md p-8">
          <h2 className="text-3xl font-bold text-gts-primary mb-6">Sign In</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-gts-accent focus:ring-gts-accent outline-none"
                placeholder="admin@gts.ai"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-gts-accent focus:ring-gts-accent outline-none"
                placeholder="********"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gts-primary text-white py-2 px-4 rounded-md hover:bg-gts-secondary transition-colors"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;