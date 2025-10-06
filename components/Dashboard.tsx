import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import { useSync } from '../hooks/useSync';
import { useAuth } from '../hooks/useAuth';
import { SymptomLog, HealthStatus, Symptom } from '../types';
import ThemeToggle from './ThemeToggle';

const StatusIndicator: React.FC<{ status: HealthStatus }> = ({ status }) => {
  const statusConfig = {
    [HealthStatus.Healthy]: { 
      gradient: 'from-emerald-500 to-teal-600', 
      bg: 'status-card-healthy',
      text: 'Village Healthy', 
      icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15l-5-5 1.41-1.41L11 14.17l7.59-7.59L20 8l-9 9z',
      pulse: 'animate-pulse'
    },
    [HealthStatus.Monitoring]: { 
      gradient: 'from-amber-500 to-orange-600', 
      bg: 'status-card-monitoring',
      text: 'Health Monitoring', 
      icon: 'M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z',
      pulse: 'animate-bounce'
    },
    [HealthStatus.OutbreakRisk]: { 
      gradient: 'from-red-500 to-rose-600', 
      bg: 'status-card-risk',
      text: 'Outbreak Risk', 
      icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z',
      pulse: 'animate-pulse'
    },
  };
  const config = statusConfig[status];
  
  return (
    <div className="modern-card p-8 text-center relative overflow-hidden group">
      {/* Animated background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-500`} />
      
      {/* Status icon with modern styling */}
      <div className={`relative w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 mx-auto rounded-full bg-gradient-to-br ${config.gradient} flex items-center justify-center shadow-xl mb-4 sm:mb-6 group-hover:scale-105 transition-transform duration-300`}>
        <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${config.gradient} ${config.pulse}`} style={{ opacity: 0.3 }} />
        <svg xmlns="http://www.w3.org/2000/svg" className="relative h-10 w-10 sm:h-12 sm:w-12 lg:h-16 lg:w-16 text-white drop-shadow-lg" viewBox="0 0 24 24" fill="currentColor">
          <path d={config.icon}></path>
        </svg>
      </div>
      
      {/* Status text with modern typography */}
      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">
        {config.text}
      </h2>
      <p className="text-slate-600 dark:text-slate-300 font-medium text-sm sm:text-base lg:text-lg">Community Health Overview</p>
      
      {/* Decorative elements */}
      <div className="absolute top-4 right-4 w-12 h-12 bg-gradient-to-br from-white/20 to-transparent rounded-full" />
      <div className="absolute bottom-4 left-4 w-8 h-8 bg-gradient-to-br from-white/10 to-transparent rounded-full" />
    </div>
  );
};

const MetricCard: React.FC<{ title: string; value: string | number; description: string; icon?: string; gradient?: string }> = ({ 
  title, 
  value, 
  description, 
  icon = "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  gradient = "from-blue-500 to-purple-600"
}) => (
  <div className="metric-card group">
    <div className="flex items-start justify-between mb-4">
      <div className="flex-1">
        <h3 className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm font-semibold uppercase tracking-wide mb-2">{title}</h3>
        <p className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-200 bg-clip-text text-transparent mb-1">
          {value}
        </p>
        <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-medium">{description}</p>
      </div>
      
      {/* Modern icon with gradient background */}
      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
        </svg>
      </div>
    </div>
    
    {/* Subtle animation indicator */}
    <div className="h-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent dark:via-slate-600 rounded-full" />
  </div>
);

interface DashboardProps {
  setActiveScreen?: (screen: string) => void;
  setIsChatbotOpen?: (open: boolean) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ setActiveScreen, setIsChatbotOpen }) => {
  const [symptomLogs] = useLocalStorage<SymptomLog[]>('symptomLogs', []);
  const isOnline = useNetworkStatus();
  const { syncData, isSyncing, lastSync, syncSuccess, unsyncedCount } = useSync();
  const { user } = useAuth();

  const familiesTracked = useMemo(() => new Set(symptomLogs.map(log => log.familyId)).size, [symptomLogs]);
  const activeCases = useMemo(() => {
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);
    return symptomLogs.filter(log => new Date(log.timestamp) > twentyFourHoursAgo).length;
  }, [symptomLogs]);

  const villageStatus = useMemo(() => {
    if (activeCases > 10) return HealthStatus.OutbreakRisk;
    if (activeCases > 5) return HealthStatus.Monitoring;
    return HealthStatus.Healthy;
  }, [activeCases]);
  
  const chartData = useMemo(() => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentLogs = symptomLogs.filter(log => new Date(log.timestamp) > sevenDaysAgo);
    
    const data: { name: string; fever: number; cough: number; diarrhea: number }[] = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateString = date.toLocaleDateString('en-US', { weekday: 'short' });
        
        const logsForDay = recentLogs.filter(log => new Date(log.timestamp).toDateString() === date.toDateString());
        
        data.push({
            name: dateString,
            fever: logsForDay.filter(l => l.symptoms.includes(Symptom.Fever)).length,
            cough: logsForDay.filter(l => l.symptoms.includes(Symptom.Cough)).length,
            diarrhea: logsForDay.filter(l => l.symptoms.includes(Symptom.Diarrhea)).length,
        });
    }
    return data;
  }, [symptomLogs]);
  
  const getTimeAgo = (syncTime: string | null) => {
    if (!syncTime) return 'Never';
    const lastSyncDate = new Date(syncTime);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - lastSyncDate.getTime()) / 1000);

    if (seconds < 2) return 'Just now';
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };



  return (
    <div className="min-h-screen">
      {/* Modern Header with Gradient */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800" />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/80 to-purple-600/80" />
        <div className="relative px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
                {(() => {
                  const hour = new Date().getHours();
                  const userName = user?.name?.split(' ')[0] || 'ASHA Worker';
                  if (hour < 12) return `Good Morning, ${userName}`;
                  if (hour < 17) return `Good Afternoon, ${userName}`;
                  return `Good Evening, ${userName}`;
                })()}
              </h1>
              <p className="text-blue-100 font-medium text-sm sm:text-base">Real-time village health monitoring</p>
            </div>
            <div className="flex items-center space-x-3">
              {/* User Profile */}
              <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-full">
                <div className="w-8 h-8 sm:w-9 sm:h-9 bg-white/20 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="text-xs sm:text-sm font-semibold text-white leading-tight">
                    {user?.name || 'ASHA Worker'}
                  </div>
                  <div className="text-xs text-blue-200 capitalize leading-tight">
                    {user?.role || 'asha'}
                  </div>
                </div>
              </div>
              {/* Online Status */}
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-full">
                <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${isOnline ? 'bg-green-400 shadow-lg shadow-green-400/50' : 'bg-red-400 shadow-lg shadow-red-400/50'} animate-pulse`}></div>
                <span className="text-xs sm:text-sm font-semibold text-white">{isOnline ? 'Online' : 'Offline'}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-white/5 to-transparent rounded-full -translate-y-48 translate-x-48" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-white/5 to-transparent rounded-full translate-y-32 -translate-x-32" />
      </div>

      <div className="dashboard-container px-4 sm:px-6 lg:px-8 -mt-4 pb-6 space-y-6 sm:space-y-8 max-w-7xl mx-auto">
        {/* Main Status Card */}
        <StatusIndicator status={villageStatus} />

        {/* Sync Status Bar */}
        <div className="modern-card p-4">
          <div className="flex justify-between items-center">
            <div className="text-sm text-slate-600 dark:text-slate-300 flex-1 min-w-0">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
                <span className="font-medium truncate">
                  {syncSuccess ? 'Data synced successfully' : lastSync ? `Last sync: ${new Date(lastSync).toLocaleTimeString()}` : 'Not synced'}
                </span>
                {unsyncedCount > 0 && (
                  <span className="bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 text-xs px-2 py-1 rounded-full font-semibold">
                    {unsyncedCount} pending
                  </span>
                )}
              </div>
            </div>
            <button 
              onClick={() => syncData()} 
              disabled={isSyncing || !isOnline}
              className="p-2.5 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 active:scale-95 shadow-md flex-shrink-0"
            >
              <svg className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>

        {/* Quick Actions Section */}
        <div className="modern-card p-4 sm:p-6">
          <div className="flex items-center space-x-3 mb-4 sm:mb-6">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">Quick Actions</h3>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* Add New Patient */}
            <button 
              onClick={() => setActiveScreen?.('entry')}
              className="group flex flex-col items-center p-3 sm:p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 border border-emerald-200 hover:border-emerald-300 transition-all duration-200 hover:scale-105 hover:shadow-lg"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mb-2 sm:mb-3 group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <span className="text-xs sm:text-sm font-semibold text-emerald-700 text-center">Add Patient</span>
            </button>

            {/* View Families */}
            <button 
              onClick={() => setActiveScreen?.('familyHealth')}
              className="group flex flex-col items-center p-3 sm:p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border border-blue-200 hover:border-blue-300 transition-all duration-200 hover:scale-105 hover:shadow-lg"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-2 sm:mb-3 group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <span className="text-xs sm:text-sm font-semibold text-blue-700 text-center">View Families</span>
            </button>

            {/* Check Alerts */}
            <button 
              onClick={() => setActiveScreen?.('alerts')}
              className="group flex flex-col items-center p-3 sm:p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 border border-amber-200 hover:border-amber-300 transition-all duration-200 hover:scale-105 hover:shadow-lg"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center mb-2 sm:mb-3 group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-xs sm:text-sm font-semibold text-amber-700 text-center">Check Alerts</span>
            </button>

            {/* Training */}
            <button 
              onClick={() => setActiveScreen?.('training')}
              className="group flex flex-col items-center p-3 sm:p-4 rounded-xl bg-gradient-to-br from-purple-50 to-violet-50 hover:from-purple-100 hover:to-violet-100 border border-purple-200 hover:border-purple-300 transition-all duration-200 hover:scale-105 hover:shadow-lg"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-full flex items-center justify-center mb-2 sm:mb-3 group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <span className="text-xs sm:text-sm font-semibold text-purple-700 text-center">Training</span>
            </button>

            {/* View Analysis */}
            <button 
              onClick={() => setActiveScreen?.('analysis')}
              className="group flex flex-col items-center p-3 sm:p-4 rounded-xl bg-gradient-to-br from-rose-50 to-pink-50 hover:from-rose-100 hover:to-pink-100 border border-rose-200 hover:border-rose-300 transition-all duration-200 hover:scale-105 hover:shadow-lg"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-rose-500 to-pink-600 rounded-full flex items-center justify-center mb-2 sm:mb-3 group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <span className="text-xs sm:text-sm font-semibold text-rose-700 text-center">Analysis</span>
            </button>

            {/* Stock Management */}
            <button 
              onClick={() => setActiveScreen?.('stockManagement')}
              className="group flex flex-col items-center p-3 sm:p-4 rounded-xl bg-gradient-to-br from-teal-50 to-green-50 hover:from-teal-100 hover:to-green-100 border border-teal-200 hover:border-teal-300 transition-all duration-200 hover:scale-105 hover:shadow-lg"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-teal-500 to-green-600 rounded-full flex items-center justify-center mb-2 sm:mb-3 group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                </svg>
              </div>
              <span className="text-xs sm:text-sm font-semibold text-teal-700 text-center">Stock</span>
            </button>

            {/* ASHA Helper */}
            <button 
              onClick={() => setIsChatbotOpen?.(true)}
              className="group flex flex-col items-center p-3 sm:p-4 rounded-xl bg-gradient-to-br from-cyan-50 to-blue-50 hover:from-cyan-100 hover:to-blue-100 border border-cyan-200 hover:border-cyan-300 transition-all duration-200 hover:scale-105 hover:shadow-lg"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mb-2 sm:mb-3 group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <span className="text-xs sm:text-sm font-semibold text-cyan-700 text-center">ASHA Helper</span>
            </button>

            {/* Incentives */}
            <button 
              onClick={() => setActiveScreen?.('incentives')}
              className="group flex flex-col items-center p-3 sm:p-4 rounded-xl bg-gradient-to-br from-yellow-50 to-amber-50 hover:from-yellow-100 hover:to-amber-100 border border-yellow-200 hover:border-yellow-300 transition-all duration-200 hover:scale-105 hover:shadow-lg"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-full flex items-center justify-center mb-2 sm:mb-3 group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <span className="text-xs sm:text-sm font-semibold text-yellow-700 text-center">Incentives</span>
            </button>

            {/* Cultural Tracker */}
            <button 
              onClick={() => setActiveScreen?.('culturalTracker')}
              className="group flex flex-col items-center p-3 sm:p-4 rounded-xl bg-gradient-to-br from-purple-50 to-indigo-50 hover:from-purple-100 hover:to-indigo-100 border border-purple-200 hover:border-purple-300 transition-all duration-200 hover:scale-105 hover:shadow-lg"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mb-2 sm:mb-3 group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <span className="text-xs sm:text-sm font-semibold text-purple-700 text-center">Cultural Practices</span>
            </button>

            {/* Settings */}
            <button 
              onClick={() => setActiveScreen?.('settings')}
              className="group flex flex-col items-center p-3 sm:p-4 rounded-xl bg-gradient-to-br from-slate-50 to-gray-50 hover:from-slate-100 hover:to-gray-100 border border-slate-200 hover:border-slate-300 transition-all duration-200 hover:scale-105 hover:shadow-lg"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-slate-500 to-gray-600 rounded-full flex items-center justify-center mb-2 sm:mb-3 group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <span className="text-xs sm:text-sm font-semibold text-slate-700 text-center">Settings</span>
            </button>
          </div>
        </div>

        {/* Modern Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <MetricCard 
            title="Families Tracked" 
            value={familiesTracked} 
            description="Registered households" 
            icon="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            gradient="from-emerald-500 to-teal-600"
          />
          <MetricCard 
            title="Active Cases" 
            value={activeCases} 
            description="Last 24 hours" 
            icon="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
            gradient="from-amber-500 to-orange-600"
          />
          <MetricCard 
            title="Sync Status" 
            value={getTimeAgo(lastSync)} 
            description={unsyncedCount > 0 ? `${unsyncedCount} items pending` : 'All data synced'} 
            icon="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            gradient="from-blue-500 to-indigo-600"
          />
        </div>

        {/* Modern Chart Section */}
        <div className="chart-container">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-4">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-1">Symptom Trends</h3>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">7-day overview of reported symptoms</p>
            </div>
            <div className="flex flex-wrap gap-3 sm:gap-2">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300">Fever</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                <span className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300">Cough</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300">Diarrhea</span>
              </div>
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height={window.innerWidth < 640 ? 250 : window.innerWidth < 1024 ? 300 : 320}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" className="dark:stroke-slate-700"/>
              <XAxis 
                dataKey="name" 
                tick={{ fill: '#64748B', fontSize: 12 }} 
                className="dark:fill-slate-400" 
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                tick={{ fill: '#64748B', fontSize: 12 }} 
                className="dark:fill-slate-400" 
                allowDecimals={false} 
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white',
                  borderColor: '#E2E8F0',
                  borderRadius: '12px',
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
                  border: 'none'
                }}
                labelStyle={{ color: '#1E293B', fontWeight: '600' }}
                cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }}
              />
              <Bar dataKey="fever" fill="#EF4444" name="Fever" radius={[4, 4, 0, 0]} />
              <Bar dataKey="cough" fill="#F59E0B" name="Cough" radius={[4, 4, 0, 0]} />
              <Bar dataKey="diarrhea" fill="#3B82F6" name="Diarrhea" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
