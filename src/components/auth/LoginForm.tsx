import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const LoginForm: React.FC = () => {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [error, setError] = useState<string | null>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      await login(formData.email, formData.password);
      
      // Redirect based on email (role)
      if (formData.email.includes('donor')) {
        navigate('/donor-dashboard');
      } else if (formData.email.includes('recipient')) {
        navigate('/recipient-dashboard');
      } else if (formData.email.includes('volunteer')) {
        navigate('/volunteer-dashboard');
      } else {
        navigate('/'); // Default to home
      }
    } catch (err) {
      console.error('Login failed:', err);
      setError('Invalid email or password');
    }
  };
  
  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Log In</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="your@email.com"
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="••••••••"
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
              Remember me
            </label>
          </div>
          
          <div className="text-sm">
            <button
              type="button"
              onClick={() => alert('Password reset functionality would go here in a real app')}
              className="text-accent hover:underline bg-transparent border-none p-0 cursor-pointer font-normal"
            >
              Forgot password?
            </button>
          </div>
        </div>
        
        <div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full btn-primary py-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </div>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-accent hover:underline">
            Register here
          </Link>
        </p>
      </div>
      
      <div className="mt-8 border-t border-gray-200 pt-6">
        <p className="text-xs text-gray-500 text-center">
          For demo purposes, use any email that includes "donor", "recipient", or "volunteer"
          to log in as that role. Any password will work.
        </p>
      </div>
    </div>
  );
};

export default LoginForm; 