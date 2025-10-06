import React, { useState, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Patient, PatientEnrollment, GovernmentScheme } from '../types';
import { GOVERNMENT_SCHEMES } from '../constants';
import SchemeDetails from './SchemeDetails';
import { ChevronLeftIcon } from './Icons';

const MetricCard: React.FC<{ title: string; value: string | number; description: string; color: string; icon: string }> = ({ title, value, description, color, icon }) => (
    <div className={`modern-card p-4 sm:p-6 text-center border-l-4 ${color} hover:scale-105 transition-all duration-300`}>
      <div className={`w-12 h-12 mx-auto mb-4 bg-gradient-to-br ${icon} rounded-full flex items-center justify-center`}>
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      </div>
      <p className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-2">{value}</p>
      <h3 className="text-slate-700 dark:text-slate-300 text-sm sm:text-base font-bold mb-1">{title}</h3>
      <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm">{description}</p>
    </div>
);

interface IncentivesProps {
    onBack?: () => void;
}

const Incentives: React.FC<IncentivesProps> = ({ onBack }) => {
    const [enrollments] = useLocalStorage<PatientEnrollment[]>('patientEnrollments', []);
    const [patients] = useLocalStorage<Patient[]>('patients', []);
    const [selectedPatientId, setSelectedPatientId] = useState<string>('');
    
    const [view, setView] = useState<'list' | 'details'>('list');
    const [selectedSchemeId, setSelectedSchemeId] = useState<string | null>(null);

    const totalEnrollments = enrollments.length;
    const pendingEnrollments = enrollments.filter(e => e.status === 'Pending').length;

    const selectedPatientEnrollments = useMemo(() => {
        if (!selectedPatientId) return [];
        return enrollments.filter(e => e.patientId === selectedPatientId);
    }, [selectedPatientId, enrollments]);

    const handleViewDetails = (schemeId: string) => {
        setSelectedSchemeId(schemeId);
        setView('details');
    };

    if (view === 'details' && selectedSchemeId) {
        return <SchemeDetails schemeId={selectedSchemeId} onBack={() => setView('list')} />;
    }

    return (
        <div>
            {/* Modern Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 sm:p-6">
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
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-white">Health Incentives</h1>
                        <p className="text-indigo-100 text-sm sm:text-base">Government schemes & enrollment tracking</p>
                    </div>
                </div>
            </div>
            
            <div className="p-4 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                    <MetricCard 
                        title="Total Enrollments" 
                        value={totalEnrollments} 
                        description="Across all schemes" 
                        color="border-green-500"
                        icon="from-green-500 to-emerald-600"
                    />
                    <MetricCard 
                        title="Available Schemes" 
                        value={GOVERNMENT_SCHEMES.length} 
                        description="Government initiatives" 
                        color="border-blue-500"
                        icon="from-blue-500 to-indigo-600"
                    />
                    <MetricCard 
                        title="Pending Applications" 
                        value={pendingEnrollments} 
                        description="Awaiting confirmation" 
                        color="border-orange-500"
                        icon="from-orange-500 to-red-600"
                    />
                </div>

                {/* Patient Enrollment Check */}
                <div className="modern-card p-4 sm:p-6 border-l-4 border-indigo-500">
                    <div className="flex items-center space-x-3 mb-4 sm:mb-6">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">Patient Enrollment</h3>
                            <p className="text-sm text-indigo-600 dark:text-indigo-400">Check scheme enrollment status</p>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-4">
                        <label htmlFor="patient-select" className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Select Patient</label>
                        <select 
                            id="patient-select" 
                            value={selectedPatientId} 
                            onChange={e => setSelectedPatientId(e.target.value)}
                            className="w-full p-3 border-2 border-indigo-200 dark:border-indigo-700 rounded-lg bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-medium"
                        >
                            <option value="">-- Select a Patient --</option>
                            {patients.sort((a, b) => a.name.localeCompare(b.name)).map(p => (
                                <option key={p.id} value={p.id}>{p.name} ({p.familyId})</option>
                            ))}
                        </select>
                    </div>

                    {selectedPatientId && (
                        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                            {selectedPatientEnrollments.length > 0 ? (
                                <div className="space-y-2">
                                    <h4 className="font-semibold text-slate-800 dark:text-slate-200">Enrolled Schemes:</h4>
                                    <ul className="list-disc list-inside space-y-2 text-sm text-slate-700 dark:text-slate-300">
                                        {selectedPatientEnrollments.map(enrollment => {
                                            const scheme = GOVERNMENT_SCHEMES.find(s => s.id === enrollment.schemeId);
                                            return (
                                                <li key={enrollment.id}>
                                                    <span className="font-semibold">{scheme?.name || 'Unknown Scheme'}</span> - Status: <span className={`font-medium px-2 py-0.5 rounded-full text-xs ${enrollment.status === 'Enrolled' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200'}`}>{enrollment.status}</span>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            ) : (
                                <p className="text-slate-500 dark:text-slate-400 text-center p-2">This patient is not currently enrolled in any schemes.</p>
                            )}
                        </div>
                    )}
                </div>

                <div className="p-4 rounded-lg shadow-md bg-light-card dark:bg-dark-card">
                    <h3 className="text-lg font-semibold mb-3">Available Government Schemes</h3>
                    <div className="space-y-4">
                        {GOVERNMENT_SCHEMES.map(scheme => (
                            <div key={scheme.id} className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                                <div className="flex-grow">
                                    <h4 className="font-bold text-primary flex items-center gap-2"><span className="text-2xl">{scheme.icon}</span>{scheme.name}</h4>
                                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">{scheme.description}</p>
                                </div>
                                <button 
                                    onClick={() => handleViewDetails(scheme.id)}
                                    className="px-4 py-2 mt-2 sm:mt-0 bg-sky-600 text-white text-sm font-semibold rounded-md shadow-sm hover:bg-sky-700 transition-colors flex-shrink-0"
                                >
                                    View Details
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Incentives;
