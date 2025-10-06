import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Patient, PatientEnrollment, GovernmentScheme } from '../types';
import { GOVERNMENT_SCHEMES, MOCK_FAMILY_IDS } from '../constants';
import { XMarkIcon, ChevronLeftIcon } from './Icons';

interface SchemeDetailsProps {
    schemeId: string;
    onBack: () => void;
}

const EnrollmentModal: React.FC<{
    scheme: GovernmentScheme;
    onClose: () => void;
    onEnroll: (enrollment: Omit<PatientEnrollment, 'id' | 'synced'>) => void;
}> = ({ scheme, onClose, onEnroll }) => {
    const [patients] = useLocalStorage<Patient[]>('patients', []);
    const [familyId, setFamilyId] = useState('');
    const [patientName, setPatientName] = useState('');
    const [notes, setNotes] = useState('');
    const [status, setStatus] = useState<'Pending' | 'Enrolled'>('Pending');
    const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [error, setError] = useState('');

    React.useEffect(() => {
        if (familyId || patientName) {
            const results = patients.filter(p => 
                (familyId ? p.familyId.toLowerCase().includes(familyId.toLowerCase()) : true) && 
                (patientName ? p.name.toLowerCase().includes(patientName.toLowerCase()) : true)
            );
            setFilteredPatients(results.slice(0, 5));
        } else {
            setFilteredPatients([]);
        }
    }, [familyId, patientName, patients]);

    const handleSelectPatient = (patient: Patient) => {
        setSelectedPatient(patient);
        setFamilyId(patient.familyId);
        setPatientName(patient.name);
        setFilteredPatients([]);
    }

    const handleSubmit = () => {
        if (!selectedPatient) {
            setError('Please search for and select a patient.');
            return;
        }
        onEnroll({
            patientId: selectedPatient.id,
            familyId: selectedPatient.familyId,
            schemeId: scheme.id,
            enrollmentDate: new Date().toISOString(),
            status,
            notes,
        });
        onClose();
    };
    
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700" />
                    <div className="relative px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                                    <span className="text-lg">{scheme.icon}</span>
                                </div>
                                <h2 className="text-xl font-bold text-white">Enroll in {scheme.name}</h2>
                            </div>
                            <button onClick={onClose} className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                                <XMarkIcon className="h-5 w-5 text-white" />
                            </button>
                        </div>
                    </div>
                </div>
                <div className="p-6 space-y-6">
                    {error && (
                        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                            <p className="text-red-600 dark:text-red-400 text-sm font-medium">{error}</p>
                        </div>
                    )}
                    
                    {!selectedPatient ? (
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Search Family ID</label>
                                <input 
                                    type="text" 
                                    value={familyId} 
                                    onChange={e => setFamilyId(e.target.value)} 
                                    list="family-ids" 
                                    className="w-full p-3 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors" 
                                    placeholder="Enter family ID..."
                                />
                                <datalist id="family-ids">
                                    {MOCK_FAMILY_IDS.map(id => <option key={id} value={id} />)}
                                </datalist>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Search Patient Name</label>
                                <input 
                                    type="text" 
                                    value={patientName} 
                                    onChange={e => setPatientName(e.target.value)} 
                                    className="w-full p-3 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors" 
                                    placeholder="Enter patient name..."
                                />
                            </div>
                            {filteredPatients.length > 0 && (
                                <div className="border border-slate-200 dark:border-slate-600 rounded-lg overflow-hidden shadow-sm">
                                    <div className="max-h-40 overflow-y-auto">
                                        {filteredPatients.map(p => (
                                            <button 
                                                key={p.id} 
                                                onClick={() => handleSelectPatient(p)} 
                                                className="w-full text-left p-3 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors border-b border-slate-100 dark:border-slate-700 last:border-b-0"
                                            >
                                                <div className="font-medium text-slate-900 dark:text-slate-100">{p.name}</div>
                                                <div className="text-sm text-slate-500 dark:text-slate-400">Family ID: {p.familyId}</div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-200 dark:border-emerald-700 rounded-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-semibold text-emerald-800 dark:text-emerald-200 mb-1">Selected Patient</p>
                                    <p className="text-slate-700 dark:text-slate-300">{selectedPatient.name}</p>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Family ID: {selectedPatient.familyId}</p>
                                </div>
                                <button 
                                    onClick={() => setSelectedPatient(null)} 
                                    className="px-3 py-1 text-sm text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-800/50 rounded-md transition-colors"
                                >
                                    Change
                                </button>
                            </div>
                        </div>
                    )}
                    
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Notes (Optional)</label>
                        <textarea 
                            value={notes} 
                            onChange={e => setNotes(e.target.value)} 
                            rows={3} 
                            className="w-full p-3 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors" 
                            placeholder="Add any additional notes..."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Enrollment Status</label>
                        <select 
                            value={status} 
                            onChange={e => setStatus(e.target.value as 'Pending' | 'Enrolled')} 
                            className="w-full p-3 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                        >
                            <option value="Pending">Pending</option>
                            <option value="Enrolled">Enrolled</option>
                        </select>
                    </div>

                    <div className="flex justify-end gap-3 pt-6 border-t border-slate-200 dark:border-slate-700">
                        <button 
                            onClick={onClose} 
                            className="px-6 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleSubmit} 
                            disabled={!selectedPatient} 
                            className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transition-all duration-200"
                        >
                            Enroll Patient
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

const SchemeDetails: React.FC<SchemeDetailsProps> = ({ schemeId, onBack }) => {
    const scheme = GOVERNMENT_SCHEMES.find(s => s.id === schemeId);
    const [, setEnrollments] = useLocalStorage<PatientEnrollment[]>('patientEnrollments', []);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleEnroll = (enrollmentData: Omit<PatientEnrollment, 'id' | 'synced'>) => {
        const newEnrollment: PatientEnrollment = {
            ...enrollmentData,
            id: `ENR-${Date.now()}`,
            synced: false,
        };
        setEnrollments(prev => [newEnrollment, ...prev]);
    };

    if (!scheme) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center p-8">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Scheme Not Found</h3>
                    <p className="text-slate-500 dark:text-slate-400 mb-4">The requested scheme could not be found.</p>
                    <button onClick={onBack} className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all">
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700" />
                <div className="relative px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                    <div className="flex flex-col space-y-4">
                        <button 
                            onClick={onBack} 
                            className="w-fit flex items-center space-x-2 text-white/90 hover:text-white transition-colors group"
                        >
                            <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                                <ChevronLeftIcon className="w-4 h-4" />
                            </div>
                            <span className="font-medium">Back to Schemes</span>
                        </button>
                        
                        <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                                <span className="text-3xl">{scheme.icon}</span>
                            </div>
                            <div>
                                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">
                                    {scheme.name}
                                </h1>
                                <p className="text-emerald-100 font-medium text-lg">{scheme.description}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                <div className="modern-card p-6 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Eligibility Criteria</h3>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{scheme.eligibility}</p>
                </div>

                <div className="modern-card p-6 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Application Process</h3>
                    </div>
                    <div className="space-y-3">
                        {scheme.howToApply.map((step, index) => (
                            <div key={index} className="flex items-start space-x-3">
                                <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-white text-xs font-bold">{index + 1}</span>
                                </div>
                                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{step}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="modern-card p-6 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Contact Information</h3>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg">
                            <svg className="w-5 h-5 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <div>
                                <p className="font-semibold text-slate-900 dark:text-white">Toll-Free Helpline</p>
                                <a href={`tel:${scheme.contactInfo.phone}`} className="text-orange-600 dark:text-orange-400 hover:underline font-medium">{scheme.contactInfo.phone}</a>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg">
                            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                            </svg>
                            <div>
                                <p className="font-semibold text-slate-900 dark:text-white">Official Website</p>
                                <a href={`https://${scheme.contactInfo.website}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">{scheme.contactInfo.website}</a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="sticky bottom-0 bg-gradient-to-t from-slate-50 to-transparent dark:from-slate-900 dark:to-transparent pt-6">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="w-full p-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-lg flex items-center justify-center space-x-3"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <span>Enroll Patient in this Scheme</span>
                    </button>
                </div>
            </div>

            {isModalOpen && (
                <EnrollmentModal
                    scheme={scheme}
                    onClose={() => setIsModalOpen(false)}
                    onEnroll={handleEnroll}
                />
            )}
        </div>
    );
};

export default SchemeDetails;
