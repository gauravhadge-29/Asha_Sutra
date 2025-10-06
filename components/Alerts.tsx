import React, { useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { SymptomLog, Alert, Symptom } from '../types';
import { ChevronLeftIcon } from './Icons';

interface AlertsProps {
    onBack?: () => void;
}

const Alerts: React.FC<AlertsProps> = ({ onBack }) => {
    const [symptomLogs] = useLocalStorage<SymptomLog[]>('symptomLogs', []);
    const [alerts, setAlerts] = useLocalStorage<Alert[]>('alerts', []);

    useMemo(() => {
        const fortyEightHoursAgo = new Date();
        fortyEightHoursAgo.setHours(fortyEightHoursAgo.getHours() - 48);
        const recentLogs = symptomLogs.filter(log => new Date(log.timestamp) > fortyEightHoursAgo);
        
        // FIX: Used Symptom enum instead of string literal for type safety.
        const feverCases = recentLogs.filter(log => log.symptoms.includes(Symptom.Fever)).length;

        if (feverCases >= 5) {
            const alertId = `ALERT-FEVER-${new Date().toDateString()}`;
            if (!alerts.find(a => a.id === alertId)) {
                const newAlert: Alert = {
                    id: alertId,
                    title: `OUTBREAK RISK: Fever Cluster`,
                    description: `${feverCases} fever cases reported in the last 48 hours in Sector A. Immediate investigation required.`,
                    timestamp: new Date().toISOString(),
                    status: 'new'
                };
                setAlerts(prev => [newAlert, ...prev.filter(a => a.status === 'new')]); // Add new alert and keep other new ones
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [symptomLogs]); // This effect should re-run when logs change to generate new alerts.

    const handleAction = (alertId: string, status: Alert['status']) => {
        setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status } : a));
    };

    return (
        <div>
            {/* Modern Header */}
            <div className="bg-gradient-to-r from-red-600 to-orange-600 p-4 sm:p-6">
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
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-white">Outbreak Alerts</h1>
                        <p className="text-red-100 text-sm sm:text-base">Real-time health monitoring & alerts</p>
                    </div>
                </div>
            </div>
            <div className="p-4 space-y-6">
                {alerts.length > 0 ? (
                    <div className="space-y-4">
                        {alerts.map(alert => (
                            <div key={alert.id} className={`modern-card p-4 sm:p-6 ${alert.status === 'new' ? 'border-l-4 border-red-500 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20' : 'border-l-4 border-green-500'}`}>
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center space-x-3">
                                        <div className={`w-3 h-3 rounded-full ${alert.status === 'new' ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></div>
                                        <h3 className={`font-bold text-lg sm:text-xl ${alert.status === 'new' ? 'text-red-700 dark:text-red-400' : 'text-green-700 dark:text-green-400'}`}>{alert.title}</h3>
                                    </div>
                                    {alert.status !== 'new' && (
                                        <span className="text-xs font-bold uppercase px-3 py-1.5 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 rounded-full">
                                            {alert.status.replace('_', ' ')}
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 mb-4 leading-relaxed">{alert.description}</p>
                                <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400 mb-4">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>{new Date(alert.timestamp).toLocaleString()}</span>
                                </div>
                                {alert.status === 'new' && (
                                    <div className="flex flex-wrap gap-2 sm:gap-3">
                                        <button 
                                            onClick={() => handleAction(alert.id, 'investigated')} 
                                            className="modern-button bg-gradient-to-r from-yellow-500 to-amber-600 text-white px-4 py-2 text-sm font-semibold hover:from-yellow-600 hover:to-amber-700"
                                        >
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                            Investigate
                                        </button>
                                        <button 
                                            onClick={() => handleAction(alert.id, 'support_requested')} 
                                            className="modern-button bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 text-sm font-semibold hover:from-blue-600 hover:to-indigo-700"
                                        >
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 1 0 9.75 9.75c0-.371-.021-.74-.063-1.104" />
                                            </svg>
                                            Request Support
                                        </button>
                                        <button 
                                            onClick={() => handleAction(alert.id, 'false_alert')} 
                                            className="modern-button bg-gradient-to-r from-slate-500 to-slate-600 text-white px-4 py-2 text-sm font-semibold hover:from-slate-600 hover:to-slate-700"
                                        >
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                            False Alert
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-green-100 to-emerald-200 dark:from-green-900/30 dark:to-emerald-900/30 rounded-full flex items-center justify-center">
                            <svg className="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">All Clear!</h3>
                        <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">No active health alerts in your community. Great work maintaining village health!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Alerts;
