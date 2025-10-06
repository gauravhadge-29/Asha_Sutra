
import React, { useState, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Patient, SymptomLog } from '../types';
import { ChevronLeftIcon } from './Icons';

interface FamilyHealthProps {
    onBack?: () => void;
}

const getAge = (dob: string | undefined) => {
    if (!dob) return 'N/A';
    return new Date().getFullYear() - new Date(dob).getFullYear();
};

const PatientCard: React.FC<{ patient: Patient; logs: SymptomLog[]; isChild?: boolean }> = ({ patient, logs, isChild = false }) => {
    const recentLog = logs
        .filter(log => log.patientId === patient.id)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];

    return (
        <div className={`p-4 rounded-lg shadow-md bg-light-card dark:bg-dark-card border-l-4 ${recentLog && recentLog.severity > 7 ? 'border-health-red' : recentLog && recentLog.severity > 4 ? 'border-health-yellow' : 'border-health-green'} ${isChild ? 'ml-6' : ''}`}>
            <div className="flex justify-between items-start">
                <div>
                    <p className="font-bold text-lg text-light-text dark:text-dark-text">{patient.name}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        {patient.relationshipToHead || 'Member'} | Age: {getAge(patient.dob)}
                    </p>
                </div>
                <div className={`px-2 py-1 text-xs font-semibold rounded-full ${patient.gender === 'Male' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'}`}>{patient.gender}</div>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 text-sm space-y-2">
                <div>
                    <p className="font-semibold">Allergies:</p>
                    <p className="text-slate-600 dark:text-slate-300">{patient.allergies?.join(', ') || 'None reported'}</p>
                </div>
                <div>
                    <p className="font-semibold">Recent Symptoms:</p>
                    {recentLog ? (
                        <p className="text-slate-600 dark:text-slate-300">{recentLog.symptoms.join(', ')} - Severity: {recentLog.severity}/10</p>
                    ) : (
                        <p className="text-slate-600 dark:text-slate-300">No recent symptoms logged.</p>
                    )}
                </div>
            </div>
        </div>
    );
};


const FamilyHealth: React.FC<FamilyHealthProps> = ({ onBack }) => {
    const [patients] = useLocalStorage<Patient[]>('patients', []);
    const [symptomLogs] = useLocalStorage<SymptomLog[]>('symptomLogs', []);
    const [selectedFamilyId, setSelectedFamilyId] = useState<string>('');

    const familyIds = useMemo(() => {
        const ids = new Set(patients.map(p => p.familyId));
        return Array.from(ids).sort();
    }, [patients]);

    const familyTree = useMemo(() => {
        if (!selectedFamilyId) return null;
        const familyMembers = patients.filter(p => p.familyId === selectedFamilyId);
        const heads = familyMembers.filter(p => !p.parentId && (p.relationshipToHead === 'Head' || p.relationshipToHead === 'Spouse'));
        const children = familyMembers.filter(p => p.parentId);

        return { heads, children };
    }, [selectedFamilyId, patients]);

    return (
        <div>
            {/* Modern Header */}
            <div className="bg-gradient-to-r from-teal-600 to-cyan-600 p-4 sm:p-6">
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
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-white">Family Health</h1>
                        <p className="text-teal-100 text-sm sm:text-base">Monitor family health status</p>
                    </div>
                </div>
            </div>

            <div className="p-4 space-y-6">
                <div className="p-4 rounded-lg shadow-md bg-light-card dark:bg-dark-card">
                    <h3 className="text-lg font-semibold mb-3">Select a Family</h3>
                    <select
                        value={selectedFamilyId}
                        onChange={e => setSelectedFamilyId(e.target.value)}
                        className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-md bg-slate-50 dark:bg-slate-700 focus:ring-primary focus:border-primary"
                    >
                        <option value="">-- Select Family ID --</option>
                        {familyIds.map(id => (
                            <option key={id} value={id}>{id}</option>
                        ))}
                    </select>
                </div>

                {familyTree && (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Family: {selectedFamilyId}</h2>
                        
                        <div className="space-y-4">
                            {familyTree.heads.map(head => (
                                <div key={head.id}>
                                    <PatientCard patient={head} logs={symptomLogs} />
                                    {familyTree.children.filter(c => c.parentId === head.id).map(child => (
                                        <div key={child.id} className="mt-4">
                                            <PatientCard patient={child} logs={symptomLogs} isChild={true}/>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                         {familyTree.heads.length === 0 && familyTree.children.length > 0 && (
                            <div className="space-y-4">
                                <p className="text-slate-500 dark:text-slate-400">Orphaned members (no parent assigned):</p>
                                {familyTree.children.map(child => (
                                     <PatientCard key={child.id} patient={child} logs={symptomLogs} />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FamilyHealth;
