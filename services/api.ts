
import { SymptomLog, Patient, PatientEnrollment } from '../types';

interface SyncPayload {
    symptomLogs: SymptomLog[];
    patients: Patient[];
    patientEnrollments: PatientEnrollment[];
}

// Simulate a remote server
const api = {
    syncData: async (payload: SyncPayload): Promise<{ success: boolean; lastSync: string }> => {
        console.log("SYNCING DATA:", payload);
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Simulate a potential network error
        if (Math.random() < 0.1) { // 10% chance of failure
            console.error("SYNC FAILED: Mock network error.");
            return { success: false, lastSync: new Date().toISOString() };
        }

        try {
            // In a real app, this would be a fetch() call to a server.
            // Here, we'll just store it in another localStorage key to simulate a remote DB.
            const remoteLogs = JSON.parse(localStorage.getItem('remote_symptomLogs') || '[]') as SymptomLog[];
            const remotePatients = JSON.parse(localStorage.getItem('remote_patients') || '[]') as Patient[];
            const remoteEnrollments = JSON.parse(localStorage.getItem('remote_patientEnrollments') || '[]') as PatientEnrollment[];

            // A simple merge strategy: add new, update existing
            payload.symptomLogs.forEach(newLog => {
                const existingIndex = remoteLogs.findIndex(log => log.id === newLog.id);
                if (existingIndex > -1) {
                    remoteLogs[existingIndex] = newLog;
                } else {
                    remoteLogs.push(newLog);
                }
            });
            
            payload.patients.forEach(newPatient => {
                const existingIndex = remotePatients.findIndex(p => p.id === newPatient.id);
                if (existingIndex > -1) {
                    remotePatients[existingIndex] = newPatient;
                } else {
                    remotePatients.push(newPatient);
                }
            });

            payload.patientEnrollments.forEach(newEnrollment => {
                const existingIndex = remoteEnrollments.findIndex(e => e.id === newEnrollment.id);
                if (existingIndex > -1) {
                    remoteEnrollments[existingIndex] = newEnrollment;
                } else {
                    remoteEnrollments.push(newEnrollment);
                }
            });

            localStorage.setItem('remote_symptomLogs', JSON.stringify(remoteLogs));
            localStorage.setItem('remote_patients', JSON.stringify(remotePatients));
            localStorage.setItem('remote_patientEnrollments', JSON.stringify(remoteEnrollments));
            
            console.log("SYNC SUCCESSFUL");
            return { success: true, lastSync: new Date().toISOString() };
        } catch (error) {
            console.error("Error during mock sync:", error);
            return { success: false, lastSync: new Date().toISOString() };
        }
    },
};

export default api;