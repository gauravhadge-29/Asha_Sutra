
import React, { useState, useEffect, useCallback } from 'react';
import Dashboard from './components/Dashboard';
import PatientEntry from './components/PatientEntry';
import Analysis from './components/Analysis';
import Alerts from './components/Alerts';
import Settings from './components/Settings';
import Chatbot from './components/Chatbot';
import Training from './components/Training';
import Incentives from './components/Incentives';
import FamilyHealth from './components/FamilyHealth'; // Import the new FamilyHealth component
import StockManagement from './components/StockManagement';
import CulturalTracker from './components/CulturalTracker';
import Community from './components/Community';
import { HomeIcon, UserPlusIcon, BookOpenIcon, ChartBarIcon, BellAlertIcon, Cog6ToothIcon, ArrowPathIcon, ChatBubbleLeftEllipsisIcon, StarIcon, UsersIcon, ArchiveBoxIcon, ChevronLeftIcon, UserGroupIcon } from './components/Icons'; // Import icons
import { useSync } from './hooks/useSync';
import { useNetworkStatus } from './hooks/useNetworkStatus';
import { usePullToRefresh } from './hooks/usePullToRefresh';
import { useToast } from './hooks/useToast';
import { PullToRefreshIndicator } from './components/PullToRefreshIndicator';
import { ToastContainer } from './components/Toast';
import { seedInitialData } from './services/dummyData';
import { App as CapacitorApp } from '@capacitor/app';
import { ThemeProvider } from './hooks/useTheme';
import { AuthProvider, useAuth } from './hooks/useAuth';
import AuthContainer from './components/AuthContainer';
import AuthDebug from './components/AuthDebug';
import LandingPage from './components/LandingPage';
import { seedDemoAccounts } from './services/authData';

type Screen = 'dashboard' | 'entry' | 'training' | 'analysis' | 'alerts' | 'settings' | 'incentives' | 'familyHealth' | 'stockManagement' | 'culturalTracker' | 'community'; // All available screens - navigation only shows dashboard and training

const MainApp: React.FC = () => {
  const [activeScreen, setActiveScreen] = useState<Screen>('dashboard');
  const [navigationHistory, setNavigationHistory] = useState<Screen[]>(['dashboard']);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const { isSyncing, lastSync, syncData, syncSuccess, unsyncedCount } = useSync();
  const isOnline = useNetworkStatus();
  const { toasts, showToast, removeToast } = useToast();

  // Enhanced navigation function with history tracking
  const navigateToScreen = useCallback((screen: Screen) => {
    setNavigationHistory(prev => {
      // Don't add duplicate consecutive screens
      if (prev[prev.length - 1] === screen) {
        return prev;
      }
      // Add new screen to history (keep max 10 screens to prevent memory issues)
      const newHistory = [...prev, screen].slice(-10);
      return newHistory;
    });
    setActiveScreen(screen);
    
    // Scroll to top immediately
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // Handle back navigation
  const handleBackNavigation = useCallback(() => {
    if (isChatbotOpen) {
      setIsChatbotOpen(false);
      return true; // Indicate we handled the back action
    }

    if (navigationHistory.length > 1) {
      // Remove current screen and navigate to previous
      const newHistory = navigationHistory.slice(0, -1);
      const previousScreen = newHistory[newHistory.length - 1];
      setNavigationHistory(newHistory);
      setActiveScreen(previousScreen);
      
      // Scroll to top immediately when navigating back
      window.scrollTo({ top: 0, behavior: 'instant' });
      
      return true; // Indicate we handled the back action
    }

    // If we're on dashboard or no history, allow app to close
    return false;
  }, [navigationHistory, isChatbotOpen]);

  // Handle hardware back button (Android)
  useEffect(() => {
    const handleAppStateChange = () => {
      const handled = handleBackNavigation();
      if (!handled) {
        // If we didn't handle it, minimize the app instead of closing
        CapacitorApp.minimizeApp();
      }
    };

    // Listen for hardware back button on mobile
    CapacitorApp.addListener('backButton', handleAppStateChange);

    // Cleanup
    return () => {
      CapacitorApp.removeAllListeners();
    };
  }, [handleBackNavigation]);

  // Handle browser back button
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      event.preventDefault();
      handleBackNavigation();
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [handleBackNavigation]);

  // Scroll to top on initial load
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // Global refresh function that can be used across different screens
  const handleGlobalRefresh = useCallback(async () => {
    try {
      // Trigger sync if online
      if (isOnline && !isSyncing) {
        await syncData();
        showToast('Data synced successfully!', 'success', 2000);
      } else if (!isOnline) {
        showToast('Data refreshed locally', 'info', 2000);
      } else {
        showToast('Sync already in progress', 'warning', 2000);
      }
      
      // Add a small delay for better UX feedback
      await new Promise(resolve => setTimeout(resolve, 800));
    } catch (error) {
      showToast('Failed to refresh data', 'error', 3000);
      console.error('Refresh failed:', error);
    }
  }, [isOnline, isSyncing, syncData, showToast]);

  // Screens that should support pull-to-refresh (only main data screens)
  const refreshableScreens = ['dashboard', 'analysis'];
  const shouldShowPullToRefresh = refreshableScreens.includes(activeScreen);

  // Pull-to-refresh hook for applicable screens
  const {
    containerRef,
    isRefreshing,
    pullDistance,
    canPull,
    isTriggered
  } = usePullToRefresh({
    onRefresh: handleGlobalRefresh,
    disabled: !shouldShowPullToRefresh || isSyncing
  });

  useEffect(() => {
    // Seed demo accounts first
    seedDemoAccounts();
    
    // Seed data only if it doesn't exist
    const existingLogs = localStorage.getItem('symptomLogs');
    if (!existingLogs || JSON.parse(existingLogs).length === 0) {
      seedInitialData();
      // Reload to ensure all components re-read from localStorage
      window.location.reload(); 
    }
  }, []);


  const renderScreen = () => {
    switch (activeScreen) {
      case 'dashboard':
        return <Dashboard setActiveScreen={navigateToScreen} setIsChatbotOpen={setIsChatbotOpen} />;
      case 'entry':
        return <PatientEntry setActiveScreen={navigateToScreen} onBack={handleBackNavigation} />;
      case 'training':
        return <Training onBack={handleBackNavigation} />;
      case 'analysis':
        return <Analysis onBack={handleBackNavigation} />;
      case 'incentives':
        return <Incentives onBack={handleBackNavigation} />;
      case 'familyHealth': // Add case for familyHealth screen
        return <FamilyHealth onBack={handleBackNavigation} />;
      case 'stockManagement':
        return <StockManagement setActiveScreen={navigateToScreen} onBack={handleBackNavigation} />;
      case 'alerts':
        return <Alerts onBack={handleBackNavigation} />;
      case 'settings':
        return <Settings onBack={handleBackNavigation} />;
      case 'culturalTracker':
        return <CulturalTracker onBack={handleBackNavigation} />;
      case 'community':
        return <Community onBack={handleBackNavigation} />;
      default:
        return <Dashboard setActiveScreen={navigateToScreen} setIsChatbotOpen={setIsChatbotOpen} />;
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: HomeIcon },
    { id: 'training', label: 'Training', icon: BookOpenIcon },
    { id: 'alerts', label: 'Alerts', icon: BellAlertIcon },
    { id: 'community', label: 'Community', icon: UserGroupIcon },
  ];

  return (
    <div className="min-h-screen font-sans bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex flex-col">
      {/* Modern gradient background overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-400/5 via-purple-400/5 to-pink-400/5 pointer-events-none" />
      
      <main 
        ref={shouldShowPullToRefresh ? containerRef : null}
        className="flex-grow pb-20 relative z-10 overflow-y-auto"
        style={{
          paddingTop: shouldShowPullToRefresh && canPull ? `${Math.min(pullDistance * 0.2, 15)}px` : '0px',
          transition: shouldShowPullToRefresh && canPull ? 'none' : 'padding-top 0.3s ease-out'
        }}
      >
        {/* Global Pull to Refresh Indicator for applicable screens */}
        {shouldShowPullToRefresh && (
          <PullToRefreshIndicator
            isRefreshing={isRefreshing}
            pullDistance={pullDistance}
            canPull={canPull}
            isTriggered={isTriggered}
          />
        )}
        
        {renderScreen()}
      </main>

      {/* Modern floating action button for chatbot */}
      <button
        onClick={() => setIsChatbotOpen(true)}
        className="fab group"
        aria-label="Open ASHA Helper Chatbot"
      >
        <ChatBubbleLeftEllipsisIcon className="h-6 w-6 transition-transform group-hover:scale-110" />
      </button>

      {isChatbotOpen && <Chatbot onClose={() => setIsChatbotOpen(false)} />}
      
      {/* Toast notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      
      {/* Modern responsive navigation */}
      <footer className="fixed bottom-0 left-0 right-0 z-40">
        <div className="backdrop-blur-xl bg-white/90 dark:bg-slate-900/90 border-t border-slate-200/50 dark:border-slate-700/50 shadow-2xl">
          <nav className="safe-area-inset-bottom">
            <div className="flex items-center justify-center h-16 px-4">
              {/* Main navigation items - centered and evenly spaced */}
              <div className="flex items-center justify-around w-full max-w-md">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => navigateToScreen(item.id as Screen)}
                    className={`nav-main-item flex flex-col items-center justify-center w-16 h-12 rounded-xl transition-all duration-200 ${
                      activeScreen === item.id 
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-300'
                    } active:scale-95`}
                  >
                    <item.icon className={`h-5 w-5 mb-0.5 transition-transform ${
                      activeScreen === item.id ? 'scale-110' : 'group-hover:scale-105'
                    }`} />
                    <span className="text-xs font-medium truncate leading-tight">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </nav>
        </div>
      </footer>
</div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AuthWrapper />
      </AuthProvider>
    </ThemeProvider>
  );
};

const AuthWrapper: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const [currentView, setCurrentView] = useState<'landing' | 'auth'>('landing');
  const [authPage, setAuthPage] = useState<'login' | 'signup'>('login');

  const handleGetStarted = () => {
    setAuthPage('signup');
    setCurrentView('auth');
  };

  const handleLogin = () => {
    setAuthPage('login');
    setCurrentView('auth');
  };

  const handleBackToLanding = () => {
    setCurrentView('landing');
  };

  // Reset to landing page when user logs out
  React.useEffect(() => {
    if (!isAuthenticated) {
      setCurrentView('landing');
    }
  }, [isAuthenticated]);

  // Debug mode check
  const isDebugMode = window.location.search.includes('debug=true');
  if (isDebugMode) {
    return <AuthDebug />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">Village Health Monitor</h2>
          <div className="flex items-center justify-center space-x-1 text-slate-500 dark:text-slate-400">
            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  // Show different views based on authentication status
  if (!isAuthenticated) {
    if (currentView === 'landing') {
      return (
        <LandingPage 
          onGetStarted={handleGetStarted}
          onLogin={handleLogin}
        />
      );
    } else {
      return <AuthContainer initialPage={authPage} onBack={handleBackToLanding} />;
    }
  }

  return <MainApp />;
};

export default App;