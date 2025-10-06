
import { Patient, SymptomLog, Symptom, PatientEnrollment } from '../types';
import { MOCK_FAMILY_IDS, GOVERNMENT_SCHEMES } from '../constants';

const firstNames = ['Ramesh', 'Suresh', 'Priya', 'Anjali', 'Amit', 'Sunita', 'Vikram', 'Pooja', 'Rahul', 'Kavita'];
const lastNames = ['Kumar', 'Sharma', 'Patel', 'Singh', 'Gupta', 'Verma', 'Yadav', 'Mehta'];
const possibleAllergies = ['Penicillin', 'Sulfa Drugs', 'Latex', 'Food'];
const possibleIllnesses = ['Asthma', 'Diabetes', 'Hypertension'];

const getRandomElement = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const getRandomDate = (start: Date, end: Date): Date => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
const getAge = (dob: string) => new Date().getFullYear() - new Date(dob).getFullYear();

export const seedInitialData = () => {
    console.log("Seeding initial data...");

    const patients: Patient[] = [];
    const families: { [key: string]: string[] } = {};

    MOCK_FAMILY_IDS.forEach(familyId => {
        families[familyId] = [];
        const numMembers = Math.floor(Math.random() * 4) + 2; // 2-5 members per family
        for (let i = 0; i < numMembers; i++) {
            const id = `PAT-${familyId}-${i}`;
            const dob = getRandomDate(new Date(1960, 0, 1), new Date(2018, 0, 1)).toISOString().split('T')[0];
            
            const allergies: string[] = [];
            if (Math.random() > 0.8) { // 20% chance of having an allergy
                allergies.push(getRandomElement(possibleAllergies));
            }

            const newPatient: Patient = {
                id,
                familyId,
                name: `${getRandomElement(firstNames)} ${getRandomElement(lastNames)}`,
                dob,
                gender: Math.random() > 0.5 ? 'Male' : 'Female',
                contactNumber: `9876543${Math.floor(100 + Math.random() * 900)}`,
                pastIllnesses: Math.random() > 0.9 ? getRandomElement(possibleIllnesses) : undefined,
                allergies: allergies.length > 0 ? allergies : undefined,
                synced: true,
            };
            patients.push(newPatient);
            families[familyId].push(id);
        }
    });

    // Assign relationships
    MOCK_FAMILY_IDS.forEach(familyId => {
        const members = patients.filter(p => p.familyId === familyId);
        const adults = members.filter(p => getAge(p.dob!) >= 18);
        const children = members.filter(p => getAge(p.dob!) < 18);
        
        let head: Patient | undefined;
        if (adults.length > 0) {
            head = adults[0];
            head.relationshipToHead = 'Head';
            if (adults.length > 1) {
                adults[1].relationshipToHead = 'Spouse';
            }
        } else if (members.length > 0) {
            // In case there are no adults
            head = members[0];
            head.relationshipToHead = 'Head';
        }

        children.forEach(child => {
            child.relationshipToHead = 'Child';
            if (head) {
                child.parentId = head.id;
            }
        });
    });

    const symptomLogs: SymptomLog[] = [];
    const now = new Date();

    // Generate logs for the past 10 days
    for (let i = 9; i >= 0; i--) {
        const date = new Date();
        date.setDate(now.getDate() - i);
        const logsForDay = Math.floor(Math.random() * 5); // 0-4 logs per day

        for (let j = 0; j < logsForDay; j++) {
            const familyId = getRandomElement(MOCK_FAMILY_IDS);
            const patientId = getRandomElement(families[familyId]);
            const numSymptoms = Math.floor(Math.random() * 3) + 1;
            const symptoms: Symptom[] = [];
            while(symptoms.length < numSymptoms) {
                const symptom = getRandomElement(Object.values(Symptom));
                if (!symptoms.includes(symptom)) {
                    symptoms.push(symptom);
                }
            }

            symptomLogs.push({
                id: `LOG-${date.getTime()}-${j}`,
                patientId,
                familyId,
                symptoms,
                severity: Math.floor(Math.random() * 10) + 1,
                isUrgent: Math.random() > 0.9,
                location: { sector: 'A', household: familyId.split('-')[1] },
                timestamp: date.toISOString(),
                synced: true,
            });
        }
    }
    
    // Ensure an outbreak alert is triggered by adding recent fever cases
    for (let k = 0; k < 6; k++) {
        const alertDate = new Date();
        alertDate.setHours(now.getHours() - (k * 6)); // space them out over last day
        const familyId = getRandomElement(MOCK_FAMILY_IDS.slice(0, 4)); // cluster in first few families
        const patientId = getRandomElement(families[familyId]);

        symptomLogs.push({
            id: `LOG-ALERT-${k}`,
            patientId,
            familyId,
            symptoms: [Symptom.Fever, getRandomElement([Symptom.Cough, Symptom.Vomiting])],
            severity: Math.floor(Math.random() * 4) + 6, // 6-9 severity
            isUrgent: true,
            location: { sector: 'A', household: familyId.split('-')[1] },
            timestamp: alertDate.toISOString(),
            synced: false, // Make recent urgent cases unsynced
        });
    }

    const patientEnrollments: PatientEnrollment[] = [];
    // Enroll a few patients in schemes
    for (let i = 0; i < 10; i++) {
        const patient = getRandomElement(patients);
        const scheme = getRandomElement(GOVERNMENT_SCHEMES);
        const enrollmentDate = getRandomDate(new Date(2023, 0, 1), new Date());

        patientEnrollments.push({
            id: `ENR-SEED-${i}`,
            patientId: patient.id,
            familyId: patient.familyId,
            schemeId: scheme.id,
            enrollmentDate: enrollmentDate.toISOString(),
            status: Math.random() > 0.3 ? 'Enrolled' : 'Pending',
            synced: true,
        });
    }

    localStorage.setItem('patients', JSON.stringify(patients));
    localStorage.setItem('symptomLogs', JSON.stringify(symptomLogs));
    localStorage.setItem('patientEnrollments', JSON.stringify(patientEnrollments));
    console.log(`${patients.length} patients, ${symptomLogs.length} logs, and ${patientEnrollments.length} enrollments seeded.`);
};