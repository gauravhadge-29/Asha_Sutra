
export enum HealthStatus {
  Healthy = 'Healthy',
  Monitoring = 'Monitoring',
  OutbreakRisk = 'OutbreakRisk',
}

export enum Symptom {
    Fever = 'Fever',
    Cough = 'Cough',
    BreathingDifficulty = 'Breathing Difficulty',
    Diarrhea = 'Diarrhea',
    Rash = 'Rash',
    Vomiting = 'Vomiting',
}

export interface SymptomLog {
  id: string;
  patientId: string;
  familyId: string;
  symptoms: Symptom[];
  severity: number;
  isUrgent: boolean;
  location: { sector: string; household: string };
  photo?: string; // base64 encoded image
  timestamp: string;
  synced?: boolean;
}

export interface Patient {
    id: string;
    name: string;
    familyId: string;
    dob?: string;
    gender?: 'Male' | 'Female' | 'Other';
    contactNumber?: string;
    pastIllnesses?: string;
    allergies?: string[];
    relationshipToHead?: string; // e.g., 'Head', 'Spouse', 'Child'
    parentId?: string; // ID of the parent patient in the same family
    synced?: boolean;
}

export interface Alert {
    id: string;
    title: string;
    description: string;
    timestamp: string;
    status: 'new' | 'investigated' | 'support_requested' | 'false_alert';
}

export interface GovernmentScheme {
    id: string;
    name: string;
    description: string;
    eligibility: string;
    icon: string; // emoji or simple string
    howToApply: string[];
    contactInfo: {
        phone: string;
        website: string;
    };
}

export interface PatientEnrollment {
    id: string;
    patientId: string;
    familyId: string;
    schemeId: string;
    enrollmentDate: string; // ISO string
    status: 'Enrolled' | 'Pending' | 'Rejected' | 'Completed';
    notes?: string;
    synced?: boolean;
}

export interface ChatMessage {
    role: 'user' | 'model';
    content: string;
}

export interface MedicalStock {
    id: string;
    name: string;
    category: 'Medicine' | 'Equipment' | 'Supplies' | 'Vaccine';
    currentQuantity: number;
    minQuantity: number;
    maxQuantity: number;
    unit: string; // e.g., 'tablets', 'bottles', 'pieces', 'ml'
    expiryDate?: string; // ISO string
    batchNumber?: string;
    supplier?: string;
    cost?: number;
    lastUpdated: string;
    synced?: boolean;
}

export interface StockTransaction {
    id: string;
    stockId: string;
    type: 'IN' | 'OUT' | 'ADJUSTMENT';
    quantity: number;
    reason: string;
    patientId?: string; // if dispensed to patient
    familyId?: string;
    notes?: string;
    timestamp: string;
    performedBy: string; // ASHA worker name
    synced?: boolean;
}

export interface StockAlert {
    id: string;
    stockId: string;
    type: 'LOW_STOCK' | 'EXPIRED' | 'EXPIRING_SOON';
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    message: string;
    threshold?: number;
    acknowledged: boolean;
    timestamp: string;
}