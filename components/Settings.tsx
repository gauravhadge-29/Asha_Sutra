import React from 'react';
import { ChevronLeftIcon } from './Icons';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../hooks/useAuth';

interface SettingsProps {
  onBack?: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onBack }) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  return (
    <div>
      {/* Modern Header */}
      <div className="bg-gradient-to-r from-slate-600 to-slate-800 p-4 sm:p-6">
        <div className="flex items-center space-x-3">
          {onBack && (
            <button
              onClick={onBack}
              className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
              aria-label="Go back"
            >
              <ChevronLeftIcon className="w-5 h-5 text-white" />
            </button>
          )}
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Settings</h1>
            <p className="text-slate-200 text-sm sm:text-base">Configure your profile</p>
          </div>
        </div>
      </div>
      <div className="p-4 space-y-6">
        {/* User Profile */}
        <div className="modern-card p-4 sm:p-6 border-l-4 border-blue-500">
          <div className="flex items-center space-x-3 mb-4 sm:mb-6">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">User Profile</h3>
              <p className="text-sm text-blue-600 dark:text-blue-400">Your account details</p>
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between p-3 bg-white/80 dark:bg-slate-800/50 rounded-lg">
              <span className="font-semibold text-slate-600 dark:text-slate-300">User ID:</span>
              <span className="font-bold text-blue-700 dark:text-blue-300">{user?.id.slice(-8).toUpperCase()}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white/80 dark:bg-slate-800/50 rounded-lg">
              <span className="font-semibold text-slate-600 dark:text-slate-300">Name:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{user?.name}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white/80 dark:bg-slate-800/50 rounded-lg">
              <span className="font-semibold text-slate-600 dark:text-slate-300">Email:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{user?.email}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white/80 dark:bg-slate-800/50 rounded-lg">
              <span className="font-semibold text-slate-600 dark:text-slate-300">Role:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200 capitalize">
                {user?.role === 'asha' ? 'ASHA Worker' : user?.role === 'supervisor' ? 'Supervisor' : 'Administrator'}
              </span>
            </div>
            {user?.village && (
              <div className="flex items-center justify-between p-3 bg-white/80 dark:bg-slate-800/50 rounded-lg">
                <span className="font-semibold text-slate-600 dark:text-slate-300">Village:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{user.village}</span>
              </div>
            )}
            {user?.phone && (
              <div className="flex items-center justify-between p-3 bg-white/80 dark:bg-slate-800/50 rounded-lg">
                <span className="font-semibold text-slate-600 dark:text-slate-300">Phone:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{user.phone}</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Storage Management */}
        <div className="modern-card p-4 sm:p-6 border-l-4 border-green-500">
          <div className="flex items-center space-x-3 mb-4 sm:mb-6">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">Storage Management</h3>
              <p className="text-sm text-green-600 dark:text-green-400">Offline data & backup options</p>
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4">
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Storage Usage</span>
                <span className="text-sm font-bold text-green-700 dark:text-green-300">2.3MB / 50MB</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-full transition-all duration-300" style={{width: '4.6%'}}></div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <button className="modern-button bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 text-sm font-semibold hover:from-green-600 hover:to-emerald-700">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
                Backup Data
              </button>
              <button className="modern-button bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 text-sm font-semibold hover:from-red-600 hover:to-red-700">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Clear Data
              </button>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="modern-card p-4 sm:p-6 border-l-4 border-purple-500">
          <div className="flex items-center space-x-3 mb-4 sm:mb-6">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">Preferences</h3>
              <p className="text-sm text-purple-600 dark:text-purple-400">Customize your app experience</p>
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl p-4 space-y-4">
            <div className="flex items-center justify-between p-3 bg-white/80 dark:bg-slate-800/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
                <label htmlFor="lang-select" className="font-semibold text-slate-700 dark:text-slate-300">Language</label>
              </div>
              <select id="lang-select" className="px-3 py-2 border-2 border-purple-200 dark:border-purple-700 rounded-lg bg-white dark:bg-slate-800 text-sm font-medium focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                <option>English</option>
                <option>हिंदी (Hindi)</option>
              </select>
            </div>
            <div className="flex items-center justify-between p-3 bg-white/80 dark:bg-slate-800/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
                <label className="font-semibold text-slate-700 dark:text-slate-300">Theme Mode</label>
              </div>
              <ThemeToggle size="md" />
            </div>
          </div>
        </div>

        {/* Account Actions */}
        <div className="modern-card p-4 sm:p-6 border-l-4 border-red-500">
          <div className="flex items-center space-x-3 mb-4 sm:mb-6">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">Account Actions</h3>
              <p className="text-sm text-red-600 dark:text-red-400">Manage your account</p>
            </div>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-900/30 rounded-xl p-4">
            <button 
              onClick={handleLogout}
              className="w-full btn-primary bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white flex items-center justify-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Logout</span>
            </button>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 text-center">
              Joined on {user?.joinedAt ? new Date(user.joinedAt).toLocaleDateString() : 'Unknown'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
