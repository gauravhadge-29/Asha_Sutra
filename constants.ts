
import { Symptom, GovernmentScheme } from './types';

export const SYMPTOM_LIST: Symptom[] = [
  Symptom.Fever,
  Symptom.Cough,
  Symptom.BreathingDifficulty,
  Symptom.Diarrhea,
  Symptom.Rash,
  Symptom.Vomiting,
];

export const MOCK_FAMILY_IDS = ['FAM-001', 'FAM-002', 'FAM-003', 'FAM-004', 'FAM-005', 'FAM-006', 'FAM-007', 'FAM-008', 'FAM-009', 'FAM-010'];

export const GOVERNMENT_SCHEMES: GovernmentScheme[] = [
    {
        id: 'PMJAY',
        name: 'Pradhan Mantri Jan Arogya Yojana (PMJAY)',
        description: 'Provides health insurance coverage of up to ₹5 lakh per family per year for secondary and tertiary care hospitalization to over 10 crore poor and vulnerable families.',
        eligibility: 'Families identified based on Socio-Economic Caste Census (SECC) 2011 data. No cap on family size or age of members.',
        icon: '🏥',
        howToApply: [
            "Identify the family's eligibility through the official government portal or by contacting an ASHA worker.",
            "Visit a Common Service Centre (CSC) or an empanelled hospital with required documents (Aadhaar card, ration card).",
            "A health card ('Ayushman Card') will be issued after verification.",
            "The card can be used to avail cashless treatment at any empanelled hospital across the country."
        ],
        contactInfo: {
            phone: "14555",
            website: "https://mera.pmjay.gov.in"
        }
    },
    {
        id: 'JSSK',
        name: 'Janani Shishu Suraksha Karyakram (JSSK)',
        description: 'Aims to reduce maternal and infant mortality by entitling all pregnant women delivering in public health institutions to absolutely free and no-expense delivery, including caesarean section.',
        eligibility: 'All pregnant women, regardless of age or number of children. Also includes sick newborns up to 30 days after birth.',
        icon: '🤰',
        howToApply: [
            "Register the pregnancy at the nearest public health facility (PHC, CHC, District Hospital).",
            "Avail free antenatal check-ups, delivery, and postnatal care.",
            "Benefits include free transport from home to facility, between facilities if referred, and drop back home.",
            "Free drugs, consumables, diagnostics, and diet during the stay are also provided."
        ],
        contactInfo: {
            phone: "104",
            website: "https://nhm.gov.in/janani-shishu-suraksha-karyakram.html"
        }
    },
    {
        id: 'RBSK',
        name: 'Rashtriya Bal Swasthya Karyakram (RBSK)',
        description: 'An initiative for early identification and intervention for children from birth to 18 years to cover 4 ‘D’s: Defects at birth, Deficiencies, Diseases, and Development delays including disability.',
        eligibility: 'All children aged 0-18 years in rural areas and urban slums. Includes children in Anganwadis and government schools.',
        icon: '👶',
        howToApply: [
            "Screening is conducted by dedicated mobile health teams at Anganwadi Centres and government schools.",
            "Children identified with any of the 30 listed health conditions are referred for further investigation.",
            "Treatment, including surgeries, is provided free of cost at public health facilities.",
            "Follow-up services are also ensured to provide comprehensive care."
        ],
        contactInfo: {
            phone: "104",
            website: "https://nhm.gov.in/rashtriya-bal-swasthya-karyakram.html"
        }
    }
];