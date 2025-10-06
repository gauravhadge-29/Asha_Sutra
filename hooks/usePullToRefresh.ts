import { useState, useEffect, useCallback, useRef } from 'react';

interface PullToRefreshOptions {
  threshold?: number;
  onRefresh: () => Promise<void> | void;
  disabled?: boolean;
}

export const usePullToRefresh = ({ 
  threshold = 80, 
  onRefresh, 
  disabled = false 
}: PullToRefreshOptions) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [canPull, setCanPull] = useState(false);
  
  const touchStartY = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafId = useRef<number>();

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (disabled || isRefreshing) return;
    
    const container = containerRef.current;
    if (!container) return;

    // Only allow pull-to-refresh if we're at the very top of the page
    const isAtTop = container.scrollTop <= 2; // Small tolerance for floating point precision
    
    // Additional check: ensure we're not pulling from interactive elements
    const target = e.target as HTMLElement;
    const isInteractiveElement = target.closest('button, input, select, textarea, a, [role="button"], .recharts-wrapper, canvas, svg');
    
    // Also check if the touch started near the top of the viewport (within first 100px)
    const touchY = e.touches[0].clientY;
    const isNearTop = touchY <= 100;
    
    if (isAtTop && !isInteractiveElement && isNearTop) {
      touchStartY.current = touchY;
      setCanPull(true);
    } else {
      setCanPull(false);
    }
  }, [disabled, isRefreshing]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (disabled || isRefreshing) return;

    const container = containerRef.current;
    if (!container) return;

    const currentY = e.touches[0].clientY;
    const deltaY = currentY - touchStartY.current;

    // Critical check: Only allow pull-to-refresh when:
    // 1. We're at the very top of the container (scrollTop <= 2)
    // 2. The movement is downward (deltaY > 10) with minimum threshold
    // 3. canPull was set to true in touchStart
    // 4. The pull is significant enough (> 10px) to avoid accidental triggers
    const isAtTop = container.scrollTop <= 2;
    const isSignificantDownwardPull = deltaY > 10;
    
    if (canPull && isAtTop && isSignificantDownwardPull) {
      e.preventDefault(); // Prevent default scroll behavior
      
      // Apply resistance to the pull (elastic effect)
      const resistance = Math.min((deltaY - 10) / 2.5, threshold * 1.5);
      setPullDistance(Math.max(0, resistance));
    } else {
      // Reset if conditions are not met
      if (canPull && (!isAtTop || deltaY <= 10)) {
        setCanPull(false);
        setPullDistance(0);
      }
    }
  }, [disabled, isRefreshing, canPull, threshold]);

  const handleTouchEnd = useCallback(async () => {
    if (disabled || isRefreshing) {
      setCanPull(false);
      setPullDistance(0);
      return;
    }

    const container = containerRef.current;
    if (!container) {
      setCanPull(false);
      setPullDistance(0);
      return;
    }

    // Final check: only proceed if we're still at the top and have sufficient pull distance
    const isAtTop = container.scrollTop <= 0;
    const shouldTriggerRefresh = canPull && isAtTop && pullDistance >= threshold;

    setCanPull(false);

    if (shouldTriggerRefresh) {
      setIsRefreshing(true);
      setPullDistance(0);
      
      try {
        await onRefresh();
      } catch (error) {
        console.error('Refresh failed:', error);
      } finally {
        // Smooth reset animation
        if (rafId.current) {
          cancelAnimationFrame(rafId.current);
        }
        
        rafId.current = requestAnimationFrame(() => {
          setIsRefreshing(false);
        });
      }
    } else {
      // Animate back to 0
      setPullDistance(0);
    }
  }, [disabled, isRefreshing, canPull, pullDistance, threshold, onRefresh]);

  // Handle scroll events to reset pull state when not at top
  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    // If we're not at the top anymore, reset pull state immediately
    if (container.scrollTop > 2 && (canPull || pullDistance > 0)) {
      setCanPull(false);
      setPullDistance(0);
    }
  }, [canPull, pullDistance]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Add touch event listeners
    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });
    container.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('scroll', handleScroll);
      
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd, handleScroll]);

  return {
    containerRef,
    isRefreshing,
    pullDistance,
    canPull: canPull && pullDistance > 0,
    isTriggered: pullDistance >= threshold
  };
};