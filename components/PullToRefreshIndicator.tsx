import React from 'react';

interface PullToRefreshIndicatorProps {
  isRefreshing: boolean;
  pullDistance: number;
  canPull: boolean;
  isTriggered: boolean;
  threshold?: number;
}

export const PullToRefreshIndicator: React.FC<PullToRefreshIndicatorProps> = ({
  isRefreshing,
  pullDistance,
  canPull,
  isTriggered,
  threshold = 80
}) => {
  if (!canPull && !isRefreshing) return null;

  const progress = Math.min(pullDistance / threshold, 1);
  const rotation = progress * 180;

  return (
    <div 
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center transition-all duration-200 ease-out"
      style={{
        transform: `translateY(${isRefreshing ? '60px' : `${Math.min(pullDistance - 20, 40)}px`})`,
        opacity: canPull || isRefreshing ? 1 : 0
      }}
    >
      <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm rounded-full p-3 shadow-lg border border-white/20 dark:border-slate-700/50">
        {isRefreshing ? (
          // Spinning refresh icon when actively refreshing
          <div className="flex items-center space-x-3">
            <svg 
              className="w-6 h-6 text-blue-500 animate-spin" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
              />
            </svg>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Refreshing...
            </span>
          </div>
        ) : (
          // Pull indicator with rotation based on pull distance
          <div className="flex items-center space-x-3">
            <svg 
              className={`w-6 h-6 transition-all duration-200 ${
                isTriggered ? 'text-emerald-500' : 'text-slate-500 dark:text-slate-400'
              }`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              style={{ transform: `rotate(${rotation}deg)` }}
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
              />
            </svg>
            <span className={`text-sm font-medium transition-colors duration-200 ${
              isTriggered 
                ? 'text-emerald-600 dark:text-emerald-400' 
                : 'text-slate-600 dark:text-slate-400'
            }`}>
              {isTriggered ? 'Release to refresh' : 'Pull to refresh'}
            </span>
          </div>
        )}
        
        {/* Progress indicator */}
        {!isRefreshing && (
          <div className="mt-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1 overflow-hidden">
            <div 
              className={`h-full transition-all duration-200 ${
                isTriggered ? 'bg-emerald-500' : 'bg-blue-500'
              }`}
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
};