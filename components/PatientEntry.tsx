
import React, { useState, useEffect, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { SymptomLog, Symptom, Patient } from '../types';
import { SYMPTOM_LIST, MOCK_FAMILY_IDS } from '../constants';
import { CameraIcon, ChevronLeftIcon } from './Icons';

interface PatientEntryProps {
    setActiveScreen: (screen: string) => void;
    onBack?: () => void;
}

const ALLERGY_LIST = ['Penicillin', 'Sulfa Drugs', 'Latex', 'Food'];

const PatientEntry: React.FC<PatientEntryProps> = ({ setActiveScreen, onBack }) => {
  const [symptomLogs, setSymptomLogs] = useLocalStorage<SymptomLog[]>('symptomLogs', []);
  const [patients, setPatients] = useLocalStorage<Patient[]>('patients', []);

  const [familyId, setFamilyId] = useState('');
  const [patientName, setPatientName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other' | ''>('');
  const [contactNumber, setContactNumber] = useState('');
  const [pastIllnesses, setPastIllnesses] = useState('');
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);
  
  const [relationshipToHead, setRelationshipToHead] = useState('');
  const [parentId, setParentId] = useState('');
  
  const [selectedSymptoms, setSelectedSymptoms] = useState<Symptom[]>([]);
  const [severity, setSeverity] = useState(1);
  const [isUrgent, setIsUrgent] = useState(false);
  const [photo, setPhoto] = useState<string | undefined>(undefined);
  const [feedback, setFeedback] = useState('');
  const [feedbackType, setFeedbackType] = useState<'success' | 'error' | 'info'>('success');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const familyMembers = useMemo(() => {
    if (!familyId) return [];
    return patients.filter(p => p.familyId === familyId);
  }, [familyId, patients]);

  useEffect(() => {
    if (familyId && patientName) {
        const existingPatient = patients.find(p => p.name.toLowerCase() === patientName.toLowerCase() && p.familyId === familyId);
        if (existingPatient) {
            setDob(existingPatient.dob || '');
            setGender(existingPatient.gender || '');
            setContactNumber(existingPatient.contactNumber || '');
            setPastIllnesses(existingPatient.pastIllnesses || '');
            setSelectedAllergies(existingPatient.allergies || []);
            setRelationshipToHead(existingPatient.relationshipToHead || '');
            setParentId(existingPatient.parentId || '');
        } else {
            // Reset if patient not found
            setDob('');
            setGender('');
            setContactNumber('');
            setPastIllnesses('');
            setSelectedAllergies([]);
            setRelationshipToHead('');
            setParentId('');
        }
    }
  }, [patientName, familyId, patients]);

  const handleSymptomToggle = (symptom: Symptom) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptom) ? prev.filter(s => s !== symptom) : [...prev, symptom]
    );
  };
  
  const handleAllergyToggle = (allergy: string) => {
    setSelectedAllergies(prev =>
        prev.includes(allergy) ? prev.filter(a => a !== allergy) : [...prev, allergy]
    );
  };

  const handlePhotoCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback('');
    
    // Validation
    if (!familyId || !patientName) {
      setFeedback('⚠️ Please fill in at least Family ID and Patient Name.');
      setFeedbackType('error');
      setIsSubmitting(false);
      return;
    }
    
    if (patientName.length < 2) {
      setFeedback('⚠️ Patient name must be at least 2 characters long.');
      setFeedbackType('error');
      setIsSubmitting(false);
      return;
    }
    
    const patientIndex = patients.findIndex(p => p.name.toLowerCase() === patientName.toLowerCase() && p.familyId === familyId);
    let patientId: string;

    const patientData = {
        dob: dob,
        gender: (gender as Patient['gender']),
        contactNumber: contactNumber,
        pastIllnesses: pastIllnesses,
        allergies: selectedAllergies,
        relationshipToHead: relationshipToHead,
        parentId: parentId,
        synced: false,
    };

    if (patientIndex > -1) {
        // Update existing patient
        const existingPatient = patients[patientIndex];
        const updatedPatient: Patient = { ...existingPatient, ...patientData };
        const updatedPatients = [...patients];
        updatedPatients[patientIndex] = updatedPatient;
        setPatients(updatedPatients);
        patientId = existingPatient.id;
    } else {
        // Create new patient
        if (!dob || !gender) {
            setFeedback('📝 For new patients, please provide Date of Birth and Gender.');
            setFeedbackType('error');
            setIsSubmitting(false);
            return;
        }
        const newPatient: Patient = { 
            id: `PAT-${Date.now()}`, 
            name: patientName, 
            familyId, 
            ...patientData
        };
        setPatients(prev => [...prev, newPatient]);
        patientId = newPatient.id;
    }

    if(selectedSymptoms.length > 0) {
        const newLog: SymptomLog = {
          id: `LOG-${Date.now()}`,
          patientId: patientId,
          familyId,
          symptoms: selectedSymptoms,
          severity,
          isUrgent,
          location: { sector: 'A', household: '123' }, // Mock location
          photo,
          timestamp: new Date().toISOString(),
          synced: false,
        };
        setSymptomLogs(prev => [...prev, newLog]);
    }

    // Show success message
    const isNewPatient = patientIndex === -1;
    const successMessage = isNewPatient 
      ? `✅ New patient "${patientName}" has been successfully added to family ${familyId}!`
      : `✅ Patient "${patientName}" information has been updated successfully!`;
    
    if (selectedSymptoms.length > 0) {
      setFeedback(`${successMessage} Symptom log also recorded.`);
    } else {
      setFeedback(successMessage);
    }
    setFeedbackType('success');
    setIsSubmitting(false);
    
    // Reset form after a delay
    setTimeout(() => {
      setFamilyId('');
      setPatientName('');
      setDob('');
      setGender('');
      setContactNumber('');
      setPastIllnesses('');
      setSelectedAllergies([]);
      setRelationshipToHead('');
      setParentId('');
      setSelectedSymptoms([]);
      setSeverity(1);
      setIsUrgent(false);
      setPhoto(undefined);
      
      setTimeout(() => {
        setFeedback('');
        setActiveScreen('dashboard');
      }, 2000);
    }, 1000);
  };
  
  const severityColor = severity > 7 ? 'red' : severity > 4 ? 'yellow' : 'green';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700">
      {/* Modern Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700" />
        <div className="relative px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex items-center space-x-4 mb-2">
            {onBack && (
              <button
                onClick={onBack}
                className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                aria-label="Go back"
              >
                <ChevronLeftIcon className="w-5 h-5 text-white" />
              </button>
            )}
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">Patient Entry</h1>
            </div>
          </div>
          <p className="text-indigo-100 font-medium text-sm sm:text-base ml-14">Add new patient and symptoms</p>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-white/5 to-transparent rounded-full -translate-y-48 translate-x-48" />
      </div>

      <form onSubmit={handleSubmit} className="container px-4 sm:px-6 lg:px-8 -mt-4 pb-6 space-y-4 sm:space-y-6">
        {feedback && (
          <div className={`modern-card p-4 animate-slide-up ${
            feedbackType === 'success' 
              ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500'
              : feedbackType === 'error'
              ? 'bg-gradient-to-r from-red-50 to-rose-50 border-l-4 border-red-500'
              : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500'
          }`}>
            <div className="flex items-center">
              {feedbackType === 'success' && (
                <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
              {feedbackType === 'error' && (
                <svg className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
              {feedbackType === 'info' && (
                <svg className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              )}
              <span className={`font-medium ${
                feedbackType === 'success' ? 'text-green-800' 
                : feedbackType === 'error' ? 'text-red-800'
                : 'text-blue-800'
              }`}>{feedback}</span>
            </div>
          </div>
        )}
        
        {/* Patient Details Section */}
        <div className="modern-card p-6 space-y-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Patient Details</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label htmlFor="familyId" className="block text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Family ID</label>
              <input 
                type="text" 
                id="familyId" 
                value={familyId} 
                onChange={e => setFamilyId(e.target.value)} 
                list="family-ids" 
                className="modern-input focus-ring" 
                placeholder="Enter family ID"
              />
              <datalist id="family-ids">
                {MOCK_FAMILY_IDS.map(id => <option key={id} value={id} />)}
              </datalist>
            </div>
            <div>
              <label htmlFor="patientName" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Patient Name</label>
              <input 
                type="text" 
                id="patientName" 
                value={patientName} 
                onChange={e => setPatientName(e.target.value)} 
                className="modern-input focus-ring" 
                placeholder="Enter patient name"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div>
              <label htmlFor="dob" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Date of Birth</label>
              <input 
                type="date" 
                id="dob" 
                value={dob} 
                onChange={e => setDob(e.target.value)} 
                className="modern-input focus-ring" 
              />
            </div>
            <div>
              <label htmlFor="gender" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Gender</label>
              <select 
                id="gender" 
                value={gender} 
                onChange={e => setGender(e.target.value as 'Male' | 'Female' | 'Other' | '')} 
                className="modern-input focus-ring"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label htmlFor="contactNumber" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Contact Number</label>
              <input 
                type="tel" 
                id="contactNumber" 
                value={contactNumber} 
                onChange={e => setContactNumber(e.target.value)} 
                className="modern-input focus-ring" 
                placeholder="+91 98765 43210"
              />
            </div>
          </div>
        </div>

        <div className="p-4 rounded-lg shadow-md bg-light-card dark:bg-dark-card space-y-4">
            <h3 className="text-lg font-semibold">Family Information</h3>
            <div>
                <label htmlFor="relationship" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Relationship to Head of Family</label>
                <select id="relationship" value={relationshipToHead} onChange={e => setRelationshipToHead(e.target.value)} className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-md bg-slate-50 dark:bg-slate-700 focus:ring-primary focus:border-primary">
                    <option value="">Select Relationship</option>
                    <option value="Head">Head of Family</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Child">Child</option>
                    <option value="Parent">Parent</option>
                    <option value="Other">Other</option>
                </select>
            </div>
             {relationshipToHead === 'Child' && familyMembers.length > 0 && (
                <div>
                    <label htmlFor="parent" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Select Parent</label>
                    <select id="parent" value={parentId} onChange={e => setParentId(e.target.value)} className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-md bg-slate-50 dark:bg-slate-700 focus:ring-primary focus:border-primary">
                        <option value="">Select a parent</option>
                        {familyMembers.map(member => (
                            <option key={member.id} value={member.id}>{member.name}</option>
                        ))}
                    </select>
                </div>
            )}
        </div>

         <div className="p-4 rounded-lg shadow-md bg-light-card dark:bg-dark-card space-y-4">
          <h3 className="text-lg font-semibold">Medical History</h3>
          <div>
              <label htmlFor="pastIllnesses" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Past Illnesses / Chronic Conditions</label>
              <textarea 
                  id="pastIllnesses" 
                  value={pastIllnesses} 
                  onChange={e => setPastIllnesses(e.target.value)} 
                  rows={3}
                  placeholder="e.g., Asthma, Diabetes"
                  className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-md bg-slate-50 dark:bg-slate-700 focus:ring-primary focus:border-primary"
              />
          </div>
          <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Known Allergies</label>
              <div className="flex flex-wrap gap-2">
                  {ALLERGY_LIST.map(allergy => (
                      <button 
                          key={allergy} 
                          type="button" 
                          onClick={() => handleAllergyToggle(allergy)}
                          className={`px-3 py-1.5 rounded-full text-sm font-medium border-2 transition-colors ${
                              selectedAllergies.includes(allergy) 
                              ? 'bg-primary border-primary text-white' 
                              : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300'
                          }`}
                      >
                          {allergy}
                      </button>
                  ))}
              </div>
          </div>
        </div>
        
        <div className="p-4 rounded-lg shadow-md bg-light-card dark:bg-dark-card">
          <h3 className="text-lg font-semibold mb-3">Symptoms (if any)</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
            {SYMPTOM_LIST.map(symptom => (
              <button key={symptom} type="button" onClick={() => handleSymptomToggle(symptom)}
                className={`p-2 sm:p-3 rounded-md text-center text-xs sm:text-sm font-medium border-2 transition-colors ${
                  selectedSymptoms.includes(symptom) 
                  ? 'bg-primary border-primary text-white' 
                  : 'bg-transparent border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300'
                }`}
              >
                {symptom}
              </button>
            ))}
          </div>
        </div>

        {selectedSymptoms.length > 0 && (
          <>
            <div className="p-4 rounded-lg shadow-md bg-light-card dark:bg-dark-card">
              <h3 className="text-base sm:text-lg font-semibold mb-2">Severity: <span className={`font-bold text-${severityColor}-500`}>{severity}</span></h3>
              <input type="range" min="1" max="10" value={severity} onChange={e => setSeverity(parseInt(e.target.value, 10))} 
                  className="w-full h-3 bg-gradient-to-r from-health-green via-health-yellow to-health-red rounded-lg appearance-none cursor-pointer" />
            </div>

            <div className="p-4 rounded-lg shadow-md bg-light-card dark:bg-dark-card flex items-center justify-between">
              <label htmlFor="isUrgent" className={`text-lg font-semibold ${isUrgent ? 'text-health-red' : ''}`}>Mark as URGENT</label>
              <button type="button" onClick={() => setIsUrgent(!isUrgent)} className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors ${isUrgent ? 'bg-health-red' : 'bg-slate-300'}`}>
                <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${isUrgent ? 'translate-x-9' : 'translate-x-1'}`} />
              </button>
            </div>
            
            <div className="p-4 rounded-lg shadow-md bg-light-card dark:bg-dark-card">
                <label className="flex items-center justify-center w-full p-6 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-md cursor-pointer text-slate-500 dark:text-slate-400">
                    <CameraIcon className="w-8 h-8 mr-2"/>
                    <span>{photo ? 'Photo Attached' : 'Attach Photo'}</span>
                    <input type="file" accept="image/*" capture="environment" onChange={handlePhotoCapture} className="hidden" />
                </label>
                {photo && <img src={photo} alt="Condition" className="mt-4 rounded-md max-h-48 mx-auto" />}
            </div>
          </>
        )}

        {/* Helpful Info */}
        <div className="modern-card p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500">
          <div className="flex items-start space-x-3">
            <svg className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">📝 Quick Tip:</p>
              <p>All data is saved locally on your device for offline access. You can sync with the server later when connected to the internet.</p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          disabled={isSubmitting}
          className={`btn-primary w-full py-3 sm:py-4 text-base sm:text-lg font-bold shadow-xl transition-all duration-200 ${
            isSubmitting 
              ? 'opacity-75 cursor-not-allowed transform-none' 
              : 'hover:shadow-2xl transform hover:scale-[1.02]'
          }`}
        >
          <div className="flex items-center justify-center space-x-2">
            {isSubmitting ? (
              <>
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Save Patient Record</span>
              </>
            )}
          </div>
        </button>
      </form>
    </div>
  );
};

export default PatientEntry;