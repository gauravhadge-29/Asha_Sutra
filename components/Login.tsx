import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { EyeIcon, EyeSlashIcon } from './Icons';

interface LoginProps {
  onSwitchToSignup: () => void;
  onBack?: () => void;
}

const Login: React.FC<LoginProps> = ({ onSwitchToSignup, onBack }) => {
  const { login, loading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Debug localStorage and ensure demo accounts on component mount
  React.useEffect(() => {
    console.log('Login component mounted');
    
    // Force create demo accounts if they don't exist
    const demoUsers = [
      {
        id: 'user_demo_asha',
        name: 'Sunita Devi',
        email: 'asha@demo.com',
        password: 'demo123',
        role: 'asha',
        phone: '+91 9876543210',
        village: 'Rampur',
        joinedAt: '2024-01-15T00:00:00.000Z',
      },
      {
        id: 'user_demo_supervisor',
        name: 'Dr. Rajesh Kumar',
        email: 'supervisor@demo.com',
        password: 'demo123',
        role: 'supervisor',
        phone: '+91 9876543211',
        village: 'District Hospital',
        joinedAt: '2023-08-10T00:00:00.000Z',
      },
      {
        id: 'user_demo_admin',
        name: 'Administrator',
        email: 'admin@demo.com',
        password: 'demo123',
        role: 'admin',
        phone: '+91 9876543212',
        village: 'State Health Office',
        joinedAt: '2023-01-01T00:00:00.000Z',
      },
    ];

    // Always ensure demo accounts exist
    let existingUsers = [];
    try {
      const stored = localStorage.getItem('village_health_users');
      existingUsers = stored ? JSON.parse(stored) : [];
    } catch (e) {
      existingUsers = [];
    }

    // Add missing demo accounts
    let needsUpdate = false;
    demoUsers.forEach(demoUser => {
      if (!existingUsers.some((user: any) => user.email === demoUser.email)) {
        existingUsers.push(demoUser);
        needsUpdate = true;
      }
    });

    if (needsUpdate) {
      localStorage.setItem('village_health_users', JSON.stringify(existingUsers));
      console.log('Demo accounts ensured in Login component');
    }
    
    console.log('localStorage village_health_users:', localStorage.getItem('village_health_users'));
    console.log('localStorage village_health_user:', localStorage.getItem('village_health_user'));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const success = await login(formData.email, formData.password);
      if (!success) {
        setError('Invalid email or password');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <div className="min-h-screen flex items-start sm:items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-4 pt-16 sm:pt-4">
      <div className="modern-card w-full max-w-md p-6 sm:p-8 space-y-6 shadow-xl">
        {/* Header */}
        <div className="text-center space-y-3">
          {/* Back Button */}
          {onBack && (
            <div className="flex justify-start mb-3">
              <button
                onClick={onBack}
                className="flex items-center text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-100 transition-colors text-sm"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>
            </div>
          )}
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-7 h-7 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Welcome Back</h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">Sign in to Asha Sutra</p>
        </div>



        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="modern-input"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="modern-input pr-10"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-4 w-4 text-slate-400" />
                ) : (
                  <EyeIcon className="h-4 w-4 text-slate-400" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || loading}
            className="w-full btn-primary bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Switch to Signup */}
        <div className="text-center">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Don't have an account?{' '}
            <button
              onClick={onSwitchToSignup}
              className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium hover:underline"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;