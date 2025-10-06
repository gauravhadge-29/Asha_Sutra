import React, { useState } from 'react';
import { ChevronLeftIcon } from './Icons';

interface TrainingProps {
  onBack?: () => void;
}

interface TrainingModule {
    title: string;
    description: string;
    duration: string;
    content: string;
    videoUrl?: string;
    videoTitle?: string;
}

const trainingModules: TrainingModule[] = [
    {
        title: "Basic Health Assessment",
        description: "Learn how to conduct preliminary health checks, measure vital signs, and identify common symptoms effectively.",
        duration: "15-20 minutes",
        videoUrl: "https://www.youtube.com/embed/Dd19IvNo1sc",
        videoTitle: "Basic Health Assessment Techniques",
        content: `
# Basic Health Assessment

## Overview
As an ASHA worker, conducting basic health assessments is fundamental to your role in community healthcare.

## Key Skills You'll Learn:
- **Vital Signs Measurement**: Blood pressure, pulse, temperature, and respiratory rate
- **Visual Assessment**: Identifying visible signs of illness or distress
- **Basic Symptom Recognition**: Common symptoms and their potential causes
- **Documentation**: Proper recording of assessment findings

## Step-by-Step Process:

### 1. Preparation
- Wash hands thoroughly
- Ensure privacy and comfort for the patient
- Gather necessary tools (thermometer, BP cuff, etc.)

### 2. Initial Observation
- General appearance and behavior
- Skin color and condition
- Breathing patterns
- Level of consciousness

### 3. Vital Signs
- **Temperature**: Normal range 98.6°F (37°C)
- **Pulse**: Normal adult range 60-100 beats/minute
- **Blood Pressure**: Normal <120/80 mmHg
- **Respiration**: Normal adult range 12-20 breaths/minute

### 4. Documentation
- Record all findings clearly
- Note any abnormal observations
- Refer to appropriate healthcare provider when needed

## Key Takeaways:
- Always maintain patient dignity and privacy
- Know when to refer for advanced care
- Keep accurate records for follow-up care
        `
    },
    {
        title: "Maternal Care",
        description: "Essential guidance on prenatal and postnatal care for mothers, including nutrition, hygiene, and danger signs.",
        duration: "20-25 minutes",
        videoUrl: "https://www.youtube.com/embed/Dd19IvNo1sc",
        videoTitle: "Maternal Care Best Practices",
        content: `
# Maternal Care

## Overview
Supporting mothers through pregnancy and postpartum is crucial for maternal and infant health outcomes.

## Prenatal Care:

### Regular Check-ups
- Monthly visits during first 6 months
- Bi-weekly visits months 7-8
- Weekly visits in month 9

### Nutrition Guidelines
- **Iron**: 30-60mg daily supplements
- **Folic Acid**: 400-800mcg daily
- **Calcium**: 1000mg daily
- **Protein**: Increased intake from dal, eggs, milk

### Danger Signs to Watch For:
- Severe headaches
- Blurred vision
- Severe abdominal pain
- Bleeding
- Reduced fetal movement
- High fever

## Postnatal Care:

### First 24 Hours
- Monitor for excessive bleeding
- Ensure successful breastfeeding initiation
- Check for infections

### First Week
- Daily home visits
- Monitor healing progress
- Support with breastfeeding challenges

### Family Planning
- Discuss contraceptive options
- Provide information on spacing pregnancies

## Emergency Situations:
- Heavy bleeding (more than normal menstrual flow)
- Signs of infection (fever, foul-smelling discharge)
- Difficulty breathing
- Seizures or loss of consciousness

**Remember**: When in doubt, refer immediately to the nearest health facility.
        `
    },
    {
        title: "Child Nutrition",
        description: "Understand the nutritional needs of infants and young children to prevent malnutrition and promote healthy growth.",
        duration: "18-22 minutes",
        videoUrl: "https://www.youtube.com/embed/Dd19IvNo1sc",
        videoTitle: "Child Nutrition Guidelines",
        content: `
# Child Nutrition

## Overview
Proper nutrition in the first 1000 days of life (conception to 2 years) is critical for lifelong health and development.

## Breastfeeding Guidelines:

### 0-6 Months
- **Exclusive breastfeeding** - no water, no other foods
- Feed on demand, at least 8-12 times daily
- Proper latching techniques
- No bottles or pacifiers

### Benefits of Breastfeeding:
- Perfect nutrition for baby
- Protects against infections
- Promotes bonding
- Reduces risk of allergies

## Complementary Feeding (6+ months):

### Introduction Schedule:
- **6 months**: Start with mashed fruits and vegetables
- **7-8 months**: Add cereals and pulses
- **9-12 months**: Family foods, properly mashed

### Key Foods:
- **Energy**: Rice, wheat, oil, ghee
- **Protein**: Dal, eggs, meat, fish
- **Vitamins**: Dark green leafy vegetables, yellow/orange fruits
- **Iron**: Meat, fish, fortified cereals

## Identifying Malnutrition:

### Signs of Severe Acute Malnutrition:
- Visible severe wasting
- Bipedal edema
- MUAC < 11.5 cm (6-59 months)

### Growth Monitoring:
- Regular weight and height measurements
- Plot on growth charts
- Identify faltering growth early

## Common Feeding Problems:
- Poor appetite
- Frequent illness
- Inappropriate foods
- Inadequate feeding frequency

## Action Steps:
1. Educate families on proper feeding practices
2. Demonstrate food preparation
3. Monitor growth regularly
4. Refer malnourished children promptly
5. Follow up consistently

**Key Message**: Good nutrition starts from pregnancy and continues through the first 2 years of life.
        `
    }
];

const Training: React.FC<TrainingProps> = ({ onBack }) => {
    const [selectedModule, setSelectedModule] = useState<TrainingModule | null>(null);
    const [completedModules, setCompletedModules] = useState<Set<string>>(new Set());
    const [activeTab, setActiveTab] = useState<'video' | 'content'>('video');

    const handleStartLearning = (module: TrainingModule) => {
        setSelectedModule(module);
        setActiveTab(module.videoUrl ? 'video' : 'content');
    };

    const handleCompleteModule = (moduleTitle: string) => {
        setCompletedModules(prev => new Set([...prev, moduleTitle]));
    };

    const handleBackToModules = () => {
        setSelectedModule(null);
    };

    // Show selected module content instead of module list
    if (selectedModule) {
        return (
            <div>
                {/* Module Header */}
                <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-4 sm:p-6">
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={handleBackToModules}
                            className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                            aria-label="Back to modules"
                        >
                            <ChevronLeftIcon className="w-5 h-5 text-white" />
                        </button>
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold text-white">{selectedModule.title}</h1>
                            <p className="text-emerald-100 text-sm sm:text-base">Duration: {selectedModule.duration}</p>
                        </div>
                    </div>
                </div>

                {/* Module Content */}
                <div className="p-4 sm:p-6 max-w-4xl mx-auto">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                        {/* Tabs */}
                        {selectedModule.videoUrl && (
                            <div className="border-b dark:border-gray-700">
                                <div className="flex">
                                    <button
                                        onClick={() => setActiveTab('video')}
                                        className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                                            activeTab === 'video'
                                                ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border-b-2 border-emerald-500'
                                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                                        }`}
                                    >
                                        <div className="flex items-center justify-center space-x-2">
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M8 5v14l11-7z"/>
                                            </svg>
                                            <span>Watch Video</span>
                                        </div>
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('content')}
                                        className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                                            activeTab === 'content'
                                                ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border-b-2 border-emerald-500'
                                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                                        }`}
                                    >
                                        <div className="flex items-center justify-center space-x-2">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            <span>Read Content</span>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="p-4 sm:p-6">
                            {/* Video Tab Content */}
                            {activeTab === 'video' && selectedModule.videoUrl && (
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                        {selectedModule.videoTitle || 'Training Video'}
                                    </h3>
                                    <div className="relative w-full mb-4" style={{ paddingBottom: '56.25%' }}>
                                        <iframe
                                            className="absolute top-0 left-0 w-full h-full rounded-lg"
                                            src={selectedModule.videoUrl}
                                            title={selectedModule.videoTitle || selectedModule.title}
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        />
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                                        Watch this comprehensive video tutorial to learn about {selectedModule.title.toLowerCase()}. 
                                        You can also switch to the "Read Content" tab for detailed written materials.
                                    </p>
                                </div>
                            )}

                            {/* Content Tab or Default Content */}
                            {(activeTab === 'content' || !selectedModule.videoUrl) && (
                                <div className="prose prose-sm sm:prose max-w-none dark:prose-invert">
                                    <style jsx>{`
                                        .prose h1 { font-size: 1.25rem; margin: 1rem 0 0.5rem 0; font-weight: 700; color: #047857; }
                                        @media (min-width: 640px) { .prose h1 { font-size: 1.5rem; } }
                                        .prose h2 { font-size: 1.125rem; margin: 1rem 0 0.5rem 0; font-weight: 600; color: #059669; }
                                        @media (min-width: 640px) { .prose h2 { font-size: 1.25rem; } }
                                        .prose h3 { font-size: 1rem; margin: 0.75rem 0 0.5rem 0; font-weight: 600; color: #0d9488; }
                                        @media (min-width: 640px) { .prose h3 { font-size: 1.125rem; } }
                                        .prose p { margin: 0.5rem 0; line-height: 1.6; font-size: 0.875rem; }
                                        @media (min-width: 640px) { .prose p { font-size: 1rem; } }
                                        .prose strong { font-weight: 600; color: #374151; }
                                        .prose ul { margin: 0.5rem 0; padding-left: 1rem; }
                                        .prose li { margin: 0.25rem 0; font-size: 0.875rem; line-height: 1.5; }
                                        @media (min-width: 640px) { .prose li { font-size: 1rem; } }
                                    `}</style>
                                    <div dangerouslySetInnerHTML={{ 
                                        __html: selectedModule.content
                                            .replace(/\n\n/g, '</p><p>')
                                            .replace(/\n/g, '<br>')
                                            .replace(/### (.*?)(<br>|<p>)/g, '<h3>$1</h3>')
                                            .replace(/## (.*?)(<br>|<p>)/g, '<h2>$1</h2>')
                                            .replace(/# (.*?)(<br>|<p>)/g, '<h1>$1</h1>')
                                            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                            .replace(/^- /gm, '• ')
                                            .replace(/^(\s+)- /gm, '$1• ')
                                    }} />
                                </div>
                            )}
                        </div>
                        
                        {/* Completion Button */}
                        <div className="border-t dark:border-gray-700 p-4 sm:p-6 flex justify-center">
                            <button
                                onClick={() => handleCompleteModule(selectedModule.title)}
                                className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors text-sm sm:text-base"
                            >
                                Mark as Complete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* Modern Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-4 sm:p-6">
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
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-white">Training</h1>
                        <p className="text-emerald-100 text-sm sm:text-base">Professional Development</p>
                    </div>
                </div>
            </div>

            {/* Training Modules */}
            <div className="p-4 space-y-6">
                <div className="space-y-4 sm:space-y-6">
                    {trainingModules.map((module, index) => (
                        <div key={index} className="modern-card p-4 sm:p-6 border-l-4 border-emerald-500 hover:border-emerald-600 transition-all duration-300">
                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="flex-grow">
                                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-2">{module.title}</h3>
                                    <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">{module.description}</p>
                                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl p-4">
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                            <div className="flex items-center space-x-4 text-sm">
                                                <div className="flex items-center space-x-2 text-emerald-700 dark:text-emerald-300">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    <span className="font-medium">{module.duration}</span>
                                                </div>
                                                {module.videoUrl && (
                                                    <div className="flex items-center space-x-1 text-red-600 dark:text-red-400">
                                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M8 5v14l11-7z"/>
                                                        </svg>
                                                        <span className="font-medium text-xs">VIDEO</span>
                                                    </div>
                                                )}
                                            </div>
                                            <button 
                                                onClick={() => handleStartLearning(module)}
                                                className={`btn-primary px-4 py-2.5 sm:px-6 font-semibold transition-all duration-300 flex items-center justify-center w-full sm:w-auto ${
                                                    completedModules.has(module.title)
                                                        ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white'
                                                        : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white'
                                                }`}
                                            >
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M15 14h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                {completedModules.has(module.title) ? 'Review Module' : 'Start Learning'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Training;