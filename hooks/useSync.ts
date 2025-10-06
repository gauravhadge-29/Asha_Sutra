import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNetworkStatus } from './useNetworkStatus';
import { useLocalStorage } from './useLocalStorage';
import { SymptomLog, Patient, PatientEnrollment } from '../types';
import api from '../services/api';

export const useSync = () => {
  const isOnline = useNetworkStatus();
  const [symptomLogs, setSymptomLogs] = useLocalStorage<SymptomLog[]>('symptomLogs', []);
  const [patients, setPatients] = useLocalStorage<Patient[]>('patients', []);
  const [patientEnrollments, setPatientEnrollments] = useLocalStorage<PatientEnrollment[]>('patientEnrollments', []);
  const [lastSync, setLastSync] = useLocalStorage<string | null>('lastSync', null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);
  const [lastSyncAttempt, setLastSyncAttempt] = useState<number>(0);

  const syncData = useCallback(async () => {
    const now = Date.now();
    // Prevent sync if it was called less than 2 seconds ago
    if (now - lastSyncAttempt < 2000) {
      return;
    }
    

    if (isSyncing || !isOnline) return;
    
    setLastSyncAttempt(now);

    let unsyncedLogs = symptomLogs.filter(log => !log.synced);
    let unsyncedPatients = patients.filter(p => !p.synced);
    let unsyncedEnrollments = patientEnrollments.filter(e => !e.synced);

    if (unsyncedLogs.length === 0 && unsyncedPatients.length === 0 && unsyncedEnrollments.length === 0) {
      // Even if nothing to sync, update last sync time and show success message
      setIsSyncing(true);
      setTimeout(() => {
        setLastSync(new Date().toISOString());
        setSyncSuccess(true);
        setTimeout(() => setSyncSuccess(false), 3000);
        setIsSyncing(false);
      }, 500); // Small delay to show spinner briefly
      return;
    }

    setIsSyncing(true);

    const successfullySyncedLogIds = new Set<string>();
    const successfullySyncedPatientIds = new Set<string>();
    const successfullySyncedEnrollmentIds = new Set<string>();
    let latestSyncTime: string | null = null;

    // --- BATCH 1: URGENT LOGS ---
    const urgentLogs = unsyncedLogs.filter(l => l.isUrgent);
    if (urgentLogs.length > 0) {
        const urgentPatientIds = new Set(urgentLogs.map(l => l.patientId));
        const urgentPatients = unsyncedPatients.filter(p => urgentPatientIds.has(p.id));

        const result = await api.syncData({ symptomLogs: urgentLogs, patients: urgentPatients, patientEnrollments: [] });
        
        if (result.success) {
            latestSyncTime = result.lastSync;
            urgentLogs.forEach(l => successfullySyncedLogIds.add(l.id));
            urgentPatients.forEach(p => successfullySyncedPatientIds.add(p.id));
        } else {
            // If urgent sync fails, stop and retry later.
            setIsSyncing(false);
            return;
        }
    }
    
    // --- BATCH 2: SEVERE LOGS (non-urgent, severity > 7) ---
    unsyncedLogs = unsyncedLogs.filter(l => !successfullySyncedLogIds.has(l.id));
    unsyncedPatients = unsyncedPatients.filter(p => !successfullySyncedPatientIds.has(p.id));

    const severeLogs = unsyncedLogs.filter(l => l.severity > 7);
    if (severeLogs.length > 0) {
        severeLogs.sort((a, b) => b.severity - a.severity);
        const severePatientIds = new Set(severeLogs.map(l => l.patientId));
        const severePatients = unsyncedPatients.filter(p => severePatientIds.has(p.id));

        const result = await api.syncData({ symptomLogs: severeLogs, patients: severePatients, patientEnrollments: [] });

        if (result.success) {
            latestSyncTime = result.lastSync;
            severeLogs.forEach(l => successfullySyncedLogIds.add(l.id));
            severePatients.forEach(p => successfullySyncedPatientIds.add(p.id));
        }
        // Don't stop on failure for non-urgent batches, just move on.
    }

    // --- BATCH 3: REST OF THE DATA ---
    unsyncedLogs = unsyncedLogs.filter(l => !successfullySyncedLogIds.has(l.id));
    unsyncedPatients = unsyncedPatients.filter(p => !successfullySyncedPatientIds.has(p.id));
    
    if (unsyncedLogs.length > 0 || unsyncedPatients.length > 0 || unsyncedEnrollments.length > 0) {
        unsyncedLogs.sort((a,b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

        const result = await api.syncData({
            symptomLogs: unsyncedLogs,
            patients: unsyncedPatients,
            patientEnrollments: unsyncedEnrollments
        });

        if (result.success) {
            latestSyncTime = result.lastSync;
            unsyncedLogs.forEach(l => successfullySyncedLogIds.add(l.id));
            unsyncedPatients.forEach(p => successfullySyncedPatientIds.add(p.id));
            unsyncedEnrollments.forEach(e => successfullySyncedEnrollmentIds.add(e.id));
        }
    }

    // --- FINAL UPDATE ---
    if (successfullySyncedLogIds.size > 0 || successfullySyncedPatientIds.size > 0 || successfullySyncedEnrollmentIds.size > 0) {
        setSymptomLogs(prev => prev.map(log => successfullySyncedLogIds.has(log.id) ? { ...log, synced: true } : log));
        setPatients(prev => prev.map(p => successfullySyncedPatientIds.has(p.id) ? { ...p, synced: true } : p));
        setPatientEnrollments(prev => prev.map(e => successfullySyncedEnrollmentIds.has(e.id) ? { ...e, synced: true } : e));
        if (latestSyncTime) {
            setLastSync(latestSyncTime);
        }
        setSyncSuccess(true);
        // Hide success message after 3 seconds
        setTimeout(() => setSyncSuccess(false), 3000);
    }
    
    setIsSyncing(false);
  }, [isOnline, isSyncing, symptomLogs, patients, patientEnrollments, setSymptomLogs, setPatients, setPatientEnrollments, setLastSync]);

  useEffect(() => {
    if (isOnline) {
      syncData();
    }
  }, [isOnline]); // Removed syncData dependency to prevent constant re-runs

  useEffect(() => {
    const interval = setInterval(() => {
      if (isOnline) {
        syncData();
      }
    }, 5 * 60 * 1000); // Sync every 5 minutes

    return () => clearInterval(interval);
  }, [isOnline]); // Removed syncData dependency to prevent constant re-runs
  
  const unsyncedCount = useMemo(() => {
    return symptomLogs.filter(log => !log.synced).length + patients.filter(p => !p.synced).length + patientEnrollments.filter(e => !e.synced).length;
  }, [symptomLogs, patients, patientEnrollments]);

  return { isSyncing, lastSync, syncData, syncSuccess, unsyncedCount };
};