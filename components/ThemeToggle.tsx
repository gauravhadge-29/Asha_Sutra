import React from 'react';
import { useTheme } from '../hooks/useTheme';

interface ThemeToggleProps {
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ showLabel = true, size = 'md' }) => {
  const { theme, effectiveTheme, setTheme } = useTheme();

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const iconSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const getNextTheme = (): 'light' | 'dark' | 'system' => {
    switch (theme) {
      case 'light':
        return 'dark';
      case 'dark':
        return 'system';
      case 'system':
        return 'light';
      default:
        return 'light';
    }
  };

  const handleToggle = () => {
    setTheme(getNextTheme());
  };

  const getIcon = () => {
    if (theme === 'system') {
      return (
        <svg className={iconSizeClasses[size]} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      );
    }
    
    if (effectiveTheme === 'dark') {
      return (
        <svg className={iconSizeClasses[size]} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      );
    }
    
    return (
      <svg className={iconSizeClasses[size]} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    );
  };

  const getLabel = () => {
    switch (theme) {
      case 'light':
        return 'Light';
      case 'dark':
        return 'Dark';
      case 'system':
        return 'Auto';
      default:
        return 'Light';
    }
  };

  const getButtonColor = () => {
    if (theme === 'system') {
      return 'from-blue-500 to-purple-600';
    }
    if (effectiveTheme === 'dark') {
      return 'from-slate-600 to-slate-800';
    }
    return 'from-yellow-400 to-orange-500';
  };

  return (
    <div className="flex items-center space-x-3">
      <button
        onClick={handleToggle}
        className={`${sizeClasses[size]} bg-gradient-to-br ${getButtonColor()} text-white rounded-full flex items-center justify-center hover:scale-110 transition-all duration-200 shadow-lg hover:shadow-xl`}
        title={`Current theme: ${getLabel()}. Click to switch.`}
        aria-label={`Switch to ${getNextTheme()} theme`}
      >
        {getIcon()}
      </button>
      {showLabel && (
        <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
          <div>{getLabel()}</div>
          {theme === 'system' && (
            <div className="text-xs text-slate-500 dark:text-slate-400">
              ({effectiveTheme})
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ThemeToggle;