
import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { SymptomLog, Symptom, Patient } from '../types';
import { analyzeSymptomPattern } from '../services/geminiService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ChevronLeftIcon } from './Icons';

interface Pattern {
    title: string;
    description: string;
    symptom: Symptom;
}

interface AnalysisProps {
    onBack?: () => void;
}

const toISODateString = (date: Date) => date.toISOString().split('T')[0];

const Analysis: React.FC<AnalysisProps> = ({ onBack }) => {
    const [symptomLogs] = useLocalStorage<SymptomLog[]>('symptomLogs', []);
    const [patients] = useLocalStorage<Patient[]>('patients', []);
    const [patternAnalyses, setPatternAnalyses] = useState<Record<string, string>>({});
    const [loadingPatterns, setLoadingPatterns] = useState<Record<string, boolean>>({});
    const [selectedPattern, setSelectedPattern] = useState<Pattern | null>(null);
    const [selectedAllergy, setSelectedAllergy] = useState<string | null>(null);

    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);

    const [startDate, setStartDate] = useState<string>(toISODateString(sevenDaysAgo));
    const [endDate, setEndDate] = useState<string>(toISODateString(today));

    useEffect(() => {
        setPatternAnalyses({});
        setSelectedPattern(null);
    }, [startDate, endDate]);

    const patterns = useMemo<Pattern[]>(() => {
        if (!startDate || !endDate) return [];

        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999); 

        const timeDifference = end.getTime() - start.getTime();
        const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));
        
        if (daysDifference <= 0) return [];

        const filteredLogs = symptomLogs.filter(log => {
            const logDate = new Date(log.timestamp);
            return logDate >= start && logDate <= end;
        });

        const detectedPatterns: Pattern[] = [];
        
        const symptomCountsByFamily: Record<Symptom, Record<string, number>> = {
            [Symptom.Fever]: {}, [Symptom.Cough]: {}, [Symptom.BreathingDifficulty]: {}, [Symptom.Diarrhea]: {}, [Symptom.Rash]: {}, [Symptom.Vomiting]: {},
        };
        
        filteredLogs.forEach(log => {
            log.symptoms.forEach(symptom => {
                symptomCountsByFamily[symptom][log.familyId] = (symptomCountsByFamily[symptom][log.familyId] || 0) + 1;
            });
        });

        Object.entries(symptomCountsByFamily).forEach(([symptom, familyCounts]) => {
            const familyCount = Object.keys(familyCounts).length;
            const totalCases = Object.values(familyCounts).reduce((a, b) => a + b, 0);
            if (familyCount >= 3) {
                detectedPatterns.push({
                    title: `${symptom} Cluster`,
                    description: `${totalCases} cases in ${familyCount} families over ${daysDifference} day(s)`,
                    symptom: symptom as Symptom
                });
            }
        });
        
        return detectedPatterns;
    }, [symptomLogs, startDate, endDate]);

    const allergyData = useMemo(() => {
        const allergyCounts: { [key: string]: number } = {};
        patients.forEach(patient => {
            patient.allergies?.forEach(allergy => {
                allergyCounts[allergy] = (allergyCounts[allergy] || 0) + 1;
            });
        });
        return Object.entries(allergyCounts)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count);
    }, [patients]);

    const patientsWithSelectedAllergy = useMemo(() => {
        if (!selectedAllergy) return [];
        return patients.filter(p => p.allergies?.includes(selectedAllergy));
    }, [selectedAllergy, patients]);

    const handleGetAnalysis = useCallback(async (pattern: Pattern) => {
        const patternKey = pattern.title;
        
        // Clear all previous analyses and loading states when starting a new analysis
        setPatternAnalyses({});
        setLoadingPatterns({ [patternKey]: true });
        
        try {
            const analysis = await analyzeSymptomPattern(pattern.description);
            setPatternAnalyses({ [patternKey]: analysis });
        } catch (error) {
            console.error('Analysis failed:', error);
            setPatternAnalyses({ [patternKey]: 'Failed to get analysis. Please try again.' });
        } finally {
            setLoadingPatterns(prev => ({ ...prev, [patternKey]: false }));
        }
    }, []);

    return (
        <div className="min-h-screen">
            {/* Modern Header */}
            <div className="bg-gradient-to-r from-violet-600 to-purple-600 p-4 sm:p-6">
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
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-white">Health Analytics</h1>
                            <p className="text-purple-100 text-sm sm:text-base">Pattern analysis and insights</p>
                        </div>
                </div>
            </div>

            <div className="container px-4 sm:px-6 lg:px-8 -mt-4 pb-6 space-y-6 sm:space-y-8">
                {/* Date Filter Card */}
                <div className="modern-card p-4 sm:p-6">
                    <div className="flex items-center space-x-3 mb-4 sm:mb-6">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">Date Range Filter</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <div>
                            <label htmlFor="startDate" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Start Date</label>
                            <input 
                                type="date" 
                                id="startDate" 
                                value={startDate} 
                                onChange={e => setStartDate(e.target.value)} 
                                className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                            />
                        </div>
                        <div>
                            <label htmlFor="endDate" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">End Date</label>
                            <input 
                                type="date" 
                                id="endDate" 
                                value={endDate} 
                                onChange={e => setEndDate(e.target.value)} 
                                max={toISODateString(new Date())} 
                                className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                            />
                        </div>
                    </div>
                </div>

                {/* Symptom Patterns Card */}
                <div className="modern-card p-4 sm:p-6">
                    <div className="flex items-center space-x-3 mb-4 sm:mb-6">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">Detected Symptom Patterns</h3>
                    </div>
                    {patterns.length > 0 ? (
                        <div className="space-y-4 sm:space-y-6">{patterns.map((pattern) => {
                            const patternKey = pattern.title;
                            const isAnalyzing = loadingPatterns[patternKey];
                            const analysis = patternAnalyses[patternKey];
                            
                            return (
                                <div key={pattern.title} className="space-y-3 sm:space-y-4">
                                    {/* Pattern Box */}
                                    <div className="group p-3 sm:p-4 lg:p-6 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300">
                                        <div className="flex flex-col gap-3 sm:gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-2 mb-2">
                                                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-amber-400 to-orange-500" />
                                                    <h4 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">{pattern.title}</h4>
                                                </div>
                                                <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">{pattern.description}</p>
                                            </div>
                                            <button 
                                                onClick={() => handleGetAnalysis(pattern)} 
                                                disabled={isAnalyzing} 
                                                className="w-full sm:w-auto self-start px-4 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transition-all duration-200 flex items-center justify-center space-x-2"
                                            >
                                                {isAnalyzing ? (
                                                    <>
                                                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        <span>Analyzing...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                                        </svg>
                                                        <span>AI Analysis</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                    
                                    {/* AI Analysis Results - Appears directly below the pattern box */}
                                    {analysis && (
                                        <div className="ml-0 sm:ml-4 p-3 sm:p-4 lg:p-6 rounded-xl bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border border-purple-200 dark:border-purple-700 shadow-sm">
                                            <div className="flex items-center space-x-2 mb-3">
                                                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center">
                                                    <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                                    </svg>
                                                </div>
                                                <h5 className="font-semibold text-sm sm:text-base text-purple-900 dark:text-purple-200">AI Analysis Results</h5>
                                            </div>
                                            <div className="prose prose-sm dark:prose-invert max-w-none">
                                                <div className="whitespace-pre-wrap text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
                                                    {analysis}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}</div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 rounded-full flex items-center justify-center">
                                <svg className="w-10 h-10 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No Patterns Detected</h3>
                            <p className="text-slate-500 dark:text-slate-400">No significant symptom patterns found in the selected date range.</p>
                        </div>
                    )}
                </div>


                
                {/* Allergy Analytics */}
                <div className="modern-card p-3 sm:p-4 lg:p-6">
                    <div className="flex items-start sm:items-center space-x-3 mb-4 sm:mb-6">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-base sm:text-lg lg:text-xl font-bold text-slate-900 dark:text-white">Allergy Analytics</h3>
                            <p className="text-xs sm:text-sm text-red-600 dark:text-red-400">Community allergy prevalence patterns</p>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/10 dark:to-orange-900/10 rounded-xl p-3 sm:p-4">
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={allergyData} onClick={(data) => setSelectedAllergy(data?.activePayload?.[0]?.payload.name || null)}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:stroke-slate-700"/>
                                <XAxis dataKey="name" tick={{ fill: '#64748B', fontSize: 12 }} />
                                <YAxis tick={{ fill: '#64748B', fontSize: 12 }} allowDecimals={false} />
                                <Tooltip 
                                    contentStyle={{ 
                                        backgroundColor: 'white', 
                                        border: 'none', 
                                        borderRadius: '12px',
                                        boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
                                    }} 
                                    labelStyle={{ color: '#1e293b' }}
                                />
                                <Bar dataKey="count" name="Patients" cursor="pointer" radius={[4, 4, 0, 0]}>
                                    {allergyData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.name === selectedAllergy ? '#dc2626' : '#ef4444'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                        {selectedAllergy && (
                            <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-white/80 dark:bg-slate-800/50 rounded-lg border border-red-100 dark:border-red-900/30">
                                <div className="flex items-center space-x-2 mb-3">
                                    <div className="w-3 h-3 bg-red-500 rounded-full flex-shrink-0"></div>
                                    <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                                        Patients with {selectedAllergy} Allergy ({patientsWithSelectedAllergy.length})
                                    </h4>
                                </div>
                                <div className="max-h-32 sm:max-h-40 overflow-y-auto">
                                    <div className="grid gap-2">
                                        {patientsWithSelectedAllergy.map(p => (
                                            <div key={p.id} className="flex items-center justify-between p-2 sm:p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                                                <span className="font-medium text-sm sm:text-base text-slate-800 dark:text-slate-200 truncate flex-1 mr-2">{p.name}</span>
                                                <span className="text-xs sm:text-sm text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/40 px-2 py-1 rounded-full flex-shrink-0">
                                                    {p.familyId}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analysis;