import React, { useState, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { ChevronLeftIcon } from './Icons';

interface CulturalPractice {
  id: string;
  title: string;
  category: 'birth' | 'pregnancy' | 'childcare' | 'nutrition' | 'healing' | 'death' | 'seasonal' | 'general';
  description: string;
  medicalCompatibility: 'compatible' | 'neutral' | 'caution' | 'harmful';
  recommendations: string;
  prevalence: 'very_common' | 'common' | 'occasional' | 'rare';
  ageGroup: 'infants' | 'children' | 'adults' | 'elderly' | 'all';
  gender: 'male' | 'female' | 'all';
  region: string;
  reportedBy: string;
  dateRecorded: string;
  notes: string;
  tags: string[];
}

interface CulturalTrackerProps {
  onBack?: () => void;
}

const CulturalTracker: React.FC<CulturalTrackerProps> = ({ onBack }) => {
  const [practices, setPractices] = useLocalStorage<CulturalPractice[]>('culturalPractices', []);
  const [activeTab, setActiveTab] = useState<'list' | 'add' | 'insights'>('list');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [newPractice, setNewPractice] = useState<Partial<CulturalPractice>>({
    category: 'general',
    medicalCompatibility: 'neutral',
    prevalence: 'common',
    ageGroup: 'all',
    gender: 'all',
    region: '',
    tags: []
  });

  const categories = [
    { id: 'all', label: 'All Practices', icon: '🌍', color: 'from-slate-500 to-slate-600' },
    { id: 'birth', label: 'Birth Rituals', icon: '👶', color: 'from-pink-500 to-rose-600' },
    { id: 'pregnancy', label: 'Pregnancy Care', icon: '🤱', color: 'from-purple-500 to-indigo-600' },
    { id: 'childcare', label: 'Child Rearing', icon: '👶', color: 'from-blue-500 to-cyan-600' },
    { id: 'nutrition', label: 'Food & Diet', icon: '🍲', color: 'from-green-500 to-emerald-600' },
    { id: 'healing', label: 'Traditional Healing', icon: '🌿', color: 'from-teal-500 to-green-600' },
    { id: 'death', label: 'End of Life', icon: '🕯️', color: 'from-gray-500 to-slate-600' },
    { id: 'seasonal', label: 'Seasonal Practices', icon: '🌱', color: 'from-orange-500 to-amber-600' },
    { id: 'general', label: 'General Customs', icon: '🏛️', color: 'from-indigo-500 to-purple-600' }
  ];

  const compatibilityColors = {
    compatible: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border-green-200 dark:border-green-800',
    neutral: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-800',
    caution: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 border-yellow-200 dark:border-yellow-800',
    harmful: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 border-red-200 dark:border-red-800'
  };

  const filteredPractices = useMemo(() => {
    return practices.filter(practice => {
      const matchesCategory = selectedCategory === 'all' || practice.category === selectedCategory;
      const matchesSearch = practice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        practice.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        practice.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [practices, selectedCategory, searchTerm]);

  const handleAddPractice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPractice.title || !newPractice.description) return;

    const practice: CulturalPractice = {
      id: `cultural_${Date.now()}`,
      title: newPractice.title || '',
      category: newPractice.category || 'general',
      description: newPractice.description || '',
      medicalCompatibility: newPractice.medicalCompatibility || 'neutral',
      recommendations: newPractice.recommendations || '',
      prevalence: newPractice.prevalence || 'common',
      ageGroup: newPractice.ageGroup || 'all',
      gender: newPractice.gender || 'all',
      region: newPractice.region || '',
      reportedBy: 'ASHA Worker',
      dateRecorded: new Date().toISOString(),
      notes: newPractice.notes || '',
      tags: newPractice.tags || []
    };

    setPractices(prev => [practice, ...prev]);
    setNewPractice({
      category: 'general',
      medicalCompatibility: 'neutral',
      prevalence: 'common',
      ageGroup: 'all',
      gender: 'all',
      region: '',
      tags: []
    });
    setActiveTab('list');
  };

  const getInsights = () => {
    const totalPractices = practices.length;
    const byCategory = practices.reduce((acc, practice) => {
      acc[practice.category] = (acc[practice.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byCompatibility = practices.reduce((acc, practice) => {
      acc[practice.medicalCompatibility] = (acc[practice.medicalCompatibility] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const harmfulPractices = practices.filter(p => p.medicalCompatibility === 'harmful');
    const cautionPractices = practices.filter(p => p.medicalCompatibility === 'caution');

    return { totalPractices, byCategory, byCompatibility, harmfulPractices, cautionPractices };
  };

  const insights = getInsights();

  return (
    <div>
      {/* Modern Header */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-600 p-4 sm:p-6">
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Cultural Tracker</h1>
            <p className="text-amber-100 text-sm sm:text-base">Community beliefs & practices monitoring</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Tab Navigation */}
        <div className="flex space-x-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
          {[
            { key: 'list', label: 'Practices', icon: '📋' },
            { key: 'add', label: 'Add Practice', icon: '➕' },
            { key: 'insights', label: 'Insights', icon: '📊' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                activeTab === tab.key
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>{tab.icon}</span>
              <span className="text-sm font-semibold">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Practices List */}
        {activeTab === 'list' && (
          <div className="space-y-4">
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search practices, descriptions, or tags..."
                  className="w-full px-4 py-2 border-2 border-amber-200 dark:border-amber-700 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-slate-800"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border-2 border-amber-200 dark:border-amber-700 rounded-lg focus:ring-2 focus:ring-amber-500 dark:bg-slate-800"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.icon} {cat.label}</option>
                ))}
              </select>
            </div>

            {/* Category Quick Filter */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
              {categories.slice(1).map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                    selectedCategory === category.id
                      ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20'
                      : 'border-slate-200 dark:border-slate-700 hover:border-amber-300'
                  }`}
                >
                  <div className="text-2xl mb-1">{category.icon}</div>
                  <div className="text-xs font-medium text-slate-700 dark:text-slate-300">{category.label}</div>
                </button>
              ))}
            </div>

            {/* Practices Grid */}
            {filteredPractices.length > 0 ? (
              <div className="grid gap-4">
                {filteredPractices.map(practice => (
                  <div key={practice.id} className="modern-card p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <span className="text-2xl">
                            {categories.find(c => c.id === practice.category)?.icon || '🏛️'}
                          </span>
                          <div>
                            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                              {practice.title}
                            </h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                              {categories.find(c => c.id === practice.category)?.label}
                            </p>
                          </div>
                        </div>
                        
                        <p className="text-slate-700 dark:text-slate-300 mb-3 leading-relaxed">
                          {practice.description}
                        </p>

                        {practice.recommendations && (
                          <div className="mb-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-1">
                              Medical Recommendations:
                            </h4>
                            <p className="text-blue-700 dark:text-blue-300 text-sm">
                              {practice.recommendations}
                            </p>
                          </div>
                        )}

                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${compatibilityColors[practice.medicalCompatibility]}`}>
                            {practice.medicalCompatibility.toUpperCase()}
                          </span>
                          <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full text-xs font-medium">
                            {practice.prevalence.replace('_', ' ').toUpperCase()}
                          </span>
                          <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full text-xs font-medium">
                            {practice.ageGroup.toUpperCase()}
                          </span>
                        </div>

                        {practice.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {practice.tags.map((tag, idx) => (
                              <span key={idx} className="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 rounded text-xs">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          Recorded: {new Date(practice.dateRecorded).toLocaleDateString()}
                          {practice.region && ` • Region: ${practice.region}`}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🌍</div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Practices Found</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-4">
                  {searchTerm || selectedCategory !== 'all' 
                    ? 'Try adjusting your search or filter criteria'
                    : 'Start documenting cultural practices in your community'
                  }
                </p>
                <button
                  onClick={() => setActiveTab('add')}
                  className="modern-button bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-2 font-semibold"
                >
                  Add First Practice
                </button>
              </div>
            )}
          </div>
        )}

        {/* Add Practice Form */}
        {activeTab === 'add' && (
          <form onSubmit={handleAddPractice} className="space-y-6">
            <div className="modern-card p-4 sm:p-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Document Cultural Practice</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Practice Title *
                  </label>
                  <input
                    type="text"
                    value={newPractice.title || ''}
                    onChange={(e) => setNewPractice(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-2 border-2 border-amber-200 dark:border-amber-700 rounded-lg focus:ring-2 focus:ring-amber-500 dark:bg-slate-800"
                    placeholder="e.g., Oil massage for newborns"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Category
                  </label>
                  <select
                    value={newPractice.category}
                    onChange={(e) => setNewPractice(prev => ({ ...prev, category: e.target.value as any }))}
                    className="w-full px-4 py-2 border-2 border-amber-200 dark:border-amber-700 rounded-lg focus:ring-2 focus:ring-amber-500 dark:bg-slate-800"
                  >
                    {categories.slice(1).map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.icon} {cat.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Medical Compatibility
                  </label>
                  <select
                    value={newPractice.medicalCompatibility}
                    onChange={(e) => setNewPractice(prev => ({ ...prev, medicalCompatibility: e.target.value as any }))}
                    className="w-full px-4 py-2 border-2 border-amber-200 dark:border-amber-700 rounded-lg focus:ring-2 focus:ring-amber-500 dark:bg-slate-800"
                  >
                    <option value="compatible">✅ Compatible - Safe & Beneficial</option>
                    <option value="neutral">ℹ️ Neutral - No medical impact</option>
                    <option value="caution">⚠️ Caution - Needs monitoring</option>
                    <option value="harmful">❌ Harmful - Medical intervention needed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Prevalence
                  </label>
                  <select
                    value={newPractice.prevalence}
                    onChange={(e) => setNewPractice(prev => ({ ...prev, prevalence: e.target.value as any }))}
                    className="w-full px-4 py-2 border-2 border-amber-200 dark:border-amber-700 rounded-lg focus:ring-2 focus:ring-amber-500 dark:bg-slate-800"
                  >
                    <option value="very_common">Very Common (&gt;75%)</option>
                    <option value="common">Common (50-75%)</option>
                    <option value="occasional">Occasional (25-50%)</option>
                    <option value="rare">Rare (&lt;25%)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Age Group
                  </label>
                  <select
                    value={newPractice.ageGroup}
                    onChange={(e) => setNewPractice(prev => ({ ...prev, ageGroup: e.target.value as any }))}
                    className="w-full px-4 py-2 border-2 border-amber-200 dark:border-amber-700 rounded-lg focus:ring-2 focus:ring-amber-500 dark:bg-slate-800"
                  >
                    <option value="all">All Ages</option>
                    <option value="infants">Infants (0-1 year)</option>
                    <option value="children">Children (1-12 years)</option>
                    <option value="adults">Adults (13-60 years)</option>
                    <option value="elderly">Elderly (60+ years)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Region
                  </label>
                  <input
                    type="text"
                    value={newPractice.region || ''}
                    onChange={(e) => setNewPractice(prev => ({ ...prev, region: e.target.value }))}
                    className="w-full px-4 py-2 border-2 border-amber-200 dark:border-amber-700 rounded-lg focus:ring-2 focus:ring-amber-500 dark:bg-slate-800"
                    placeholder="e.g., Rampur village, North district"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Gender Specific
                  </label>
                  <select
                    value={newPractice.gender}
                    onChange={(e) => setNewPractice(prev => ({ ...prev, gender: e.target.value as any }))}
                    className="w-full px-4 py-2 border-2 border-amber-200 dark:border-amber-700 rounded-lg focus:ring-2 focus:ring-amber-500 dark:bg-slate-800"
                  >
                    <option value="all">All Genders</option>
                    <option value="male">Male Only</option>
                    <option value="female">Female Only</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={newPractice.description || ''}
                    onChange={(e) => setNewPractice(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-2 border-2 border-amber-200 dark:border-amber-700 rounded-lg focus:ring-2 focus:ring-amber-500 dark:bg-slate-800"
                    rows={3}
                    placeholder="Describe the practice, when it's performed, who performs it, and any materials used..."
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Medical Recommendations
                  </label>
                  <textarea
                    value={newPractice.recommendations || ''}
                    onChange={(e) => setNewPractice(prev => ({ ...prev, recommendations: e.target.value }))}
                    className="w-full px-4 py-2 border-2 border-amber-200 dark:border-amber-700 rounded-lg focus:ring-2 focus:ring-amber-500 dark:bg-slate-800"
                    rows={2}
                    placeholder="How should this practice be handled medically? Any modifications needed?"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    onChange={(e) => setNewPractice(prev => ({ 
                      ...prev, 
                      tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
                    }))}
                    className="w-full px-4 py-2 border-2 border-amber-200 dark:border-amber-700 rounded-lg focus:ring-2 focus:ring-amber-500 dark:bg-slate-800"
                    placeholder="e.g., herbal, massage, ritual, traditional, religious"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    value={newPractice.notes || ''}
                    onChange={(e) => setNewPractice(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full px-4 py-2 border-2 border-amber-200 dark:border-amber-700 rounded-lg focus:ring-2 focus:ring-amber-500 dark:bg-slate-800"
                    rows={2}
                    placeholder="Any additional observations, variations, or important details..."
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <button
                  type="submit"
                  className="modern-button bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-2 font-semibold"
                >
                  Save Practice
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('list')}
                  className="modern-button bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-6 py-2 font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Insights */}
        {activeTab === 'insights' && (
          <div className="space-y-6">
            {/* Overview Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="modern-card p-4 text-center border-l-4 border-amber-500">
                <div className="text-3xl font-bold text-slate-900 dark:text-white">{insights.totalPractices}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Total Practices</div>
              </div>
              <div className="modern-card p-4 text-center border-l-4 border-green-500">
                <div className="text-3xl font-bold text-green-600">{insights.byCompatibility.compatible || 0}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Compatible</div>
              </div>
              <div className="modern-card p-4 text-center border-l-4 border-yellow-500">
                <div className="text-3xl font-bold text-yellow-600">{insights.byCompatibility.caution || 0}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Need Caution</div>
              </div>
              <div className="modern-card p-4 text-center border-l-4 border-red-500">
                <div className="text-3xl font-bold text-red-600">{insights.byCompatibility.harmful || 0}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Harmful</div>
              </div>
            </div>

            {/* Priority Alerts */}
            {(insights.harmfulPractices.length > 0 || insights.cautionPractices.length > 0) && (
              <div className="modern-card p-4 sm:p-6 border-l-4 border-red-500">
                <h3 className="text-lg font-bold text-red-700 dark:text-red-300 mb-4">
                  ⚠️ Priority Medical Attention Required
                </h3>
                
                {insights.harmfulPractices.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-red-600 dark:text-red-400 mb-2">Harmful Practices ({insights.harmfulPractices.length})</h4>
                    <ul className="space-y-1">
                      {insights.harmfulPractices.map(practice => (
                        <li key={practice.id} className="text-sm text-red-700 dark:text-red-300">
                          • {practice.title} - {practice.description.slice(0, 100)}...
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {insights.cautionPractices.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-yellow-600 dark:text-yellow-400 mb-2">Practices Needing Caution ({insights.cautionPractices.length})</h4>
                    <ul className="space-y-1">
                      {insights.cautionPractices.map(practice => (
                        <li key={practice.id} className="text-sm text-yellow-700 dark:text-yellow-300">
                          • {practice.title} - {practice.description.slice(0, 100)}...
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Category Distribution */}
            <div className="modern-card p-4 sm:p-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Practice Categories</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {Object.entries(insights.byCategory).map(([category, count]) => {
                  const categoryInfo = categories.find(c => c.id === category);
                  return (
                    <div key={category} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl">{categoryInfo?.icon}</span>
                        <span className="text-sm font-medium">{categoryInfo?.label}</span>
                      </div>
                      <span className="font-bold text-amber-600">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {practices.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📊</div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Data Available</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-4">
                  Start documenting cultural practices to see insights and analytics
                </p>
                <button
                  onClick={() => setActiveTab('add')}
                  className="modern-button bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-2 font-semibold"
                >
                  Add First Practice
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CulturalTracker;