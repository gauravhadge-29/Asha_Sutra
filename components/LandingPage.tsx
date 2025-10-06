import React from 'react';
import { UsersIcon, ChartBarIcon } from './Icons';

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onLogin }) => {
  // Inline SVG components for missing icons
  const HeartIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  );

  const ShieldCheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );

  const ChevronRightIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );

  const features = [
    {
      icon: HeartIcon,
      title: "Health Monitoring",
      description: "Track vital signs, symptoms, and health patterns across your community"
    },
    {
      icon: UsersIcon,
      title: "Family Care",
      description: "Manage health records for entire families with comprehensive tracking"
    },
    {
      icon: ChartBarIcon,
      title: "Analytics & Insights",
      description: "AI-powered analysis to detect health patterns and potential outbreaks"
    },
    {
      icon: ShieldCheckIcon,
      title: "Training & Support",
      description: "Professional development modules and real-time assistance"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 via-teal-600/10 to-cyan-600/10" />
        <div className="relative px-4 sm:px-6 lg:px-8 pt-16 pb-12">
          <div className="max-w-4xl mx-auto text-center">
            {/* Logo/Icon */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
              <svg className="w-10 h-10 sm:w-12 sm:h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                <path d="M12 5.5c-1.5 0-2.5 1-2.5 2.5s1 2.5 2.5 2.5 2.5-1 2.5-2.5-1-2.5-2.5-2.5z" fill="rgba(255,255,255,0.3)"/>
                <circle cx="8" cy="9" r="1" fill="rgba(255,255,255,0.4)"/>
                <circle cx="16" cy="9" r="1" fill="rgba(255,255,255,0.4)"/>
              </svg>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6">
              Asha
              <span className="block text-emerald-600 dark:text-emerald-400">Sutra</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl sm:text-2xl text-slate-600 dark:text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Empowering ASHA workers with intelligent health monitoring, 
              community care management, and AI-powered insights.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <button
                onClick={onGetStarted}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <span>Get Started</span>
                <ChevronRightIcon className="w-5 h-5" />
              </button>
              
              <button
                onClick={onLogin}
                className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-lg font-semibold rounded-xl border-2 border-slate-200 dark:border-slate-600 hover:border-emerald-300 dark:hover:border-emerald-400 hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                Login
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-slate-500 dark:text-slate-400">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Offline Capable</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span>AI-Powered Analytics</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                <span>Secure & Private</span>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-emerald-200/20 to-transparent rounded-full -translate-y-48 translate-x-48" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-teal-200/20 to-transparent rounded-full translate-y-32 -translate-x-32" />
      </div>

      {/* Features Section */}
      <div className="px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Everything you need for community health
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Comprehensive tools designed specifically for ASHA workers to monitor, 
              track, and improve community health outcomes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-slate-100 dark:border-slate-700"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Built for Healthcare Heroes
          </h2>
          <p className="text-xl text-emerald-100 mb-8 leading-relaxed">
            Asha Sutra is designed with ASHA workers in mind, providing 
            intuitive tools that work both online and offline to ensure continuous 
            community health monitoring and care.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">24/7</div>
              <div className="text-emerald-100">Always Available</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">AI</div>
              <div className="text-emerald-100">Smart Analytics</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">Offline</div>
              <div className="text-emerald-100">Works Anywhere</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 sm:px-6 lg:px-8 py-8 bg-slate-900 dark:bg-slate-950">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-slate-400 text-sm">
            © 2024 Asha Sutra. Empowering communities through technology.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;