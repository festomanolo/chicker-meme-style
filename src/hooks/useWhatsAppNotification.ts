// Hook for managing WhatsApp notification timing and state
import { useState, useEffect, useCallback, useRef } from 'react';
import { NotificationState, NotificationConfig, NotificationAnalytics } from '@/types/notification';

const DEFAULT_CONFIG: NotificationConfig = {
  intervalMs: 2 * 60 * 1000, // 2 minutes
  cooldownMs: 20 * 60 * 1000, // 20 minutes
  activityThresholdMs: 30 * 1000, // 30 seconds
  maxShowsPerSession: 3,
  excludedPages: ['/settings', '/more', '/account'],
  phoneNumber: '1234567890',
  defaultMessage: 'Hi! I need help with my design.',
  enableAnalytics: true,
};

const STORAGE_KEY = 'whatsapp_notification_state';

interface UseWhatsAppNotificationOptions {
  config?: Partial<NotificationConfig>;
  onAnalytics?: (event: NotificationAnalytics) => void;
}

export const useWhatsAppNotification = (options: UseWhatsAppNotificationOptions = {}) => {
  const { config: userConfig = {}, onAnalytics } = options;
  const config = { ...DEFAULT_CONFIG, ...userConfig };

  const [state, setState] = useState<NotificationState>(() => {
    // Load state from localStorage
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          isVisible: false, // Never start visible
          lastShown: parsed.lastShown || 0,
          dismissedAt: parsed.dismissedAt || null,
          clickCount: parsed.clickCount || 0,
          showCount: parsed.showCount || 0,
          lastActivity: Date.now(),
          cooldownUntil: parsed.cooldownUntil || 0,
        };
      }
    } catch (error) {
      console.warn('Failed to load notification state:', error);
    }

    return {
      isVisible: false,
      lastShown: 0,
      dismissedAt: null,
      clickCount: 0,
      showCount: 0,
      lastActivity: Date.now(),
      cooldownUntil: 0,
    };
  });

  const intervalRef = useRef<NodeJS.Timeout>();
  const activityTimeoutRef = useRef<NodeJS.Timeout>();

  // Save state to localStorage
  const saveState = useCallback((newState: NotificationState) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        lastShown: newState.lastShown,
        dismissedAt: newState.dismissedAt,
        clickCount: newState.clickCount,
        showCount: newState.showCount,
        cooldownUntil: newState.cooldownUntil,
      }));
    } catch (error) {
      console.warn('Failed to save notification state:', error);
    }
  }, []);

  // Check if current page is excluded
  const isPageExcluded = useCallback(() => {
    const currentPath = window.location.pathname;
    return config.excludedPages.some(page => currentPath.includes(page));
  }, [config.excludedPages]);

  // Check if notification should be shown
  const shouldShowNotification = useCallback(() => {
    const now = Date.now();
    
    // Don't show if page is excluded
    if (isPageExcluded()) return false;
    
    // Don't show if already visible
    if (state.isVisible) return false;
    
    // Don't show if in cooldown period
    if (now < state.cooldownUntil) return false;
    
    // Don't show if max shows reached
    if (state.showCount >= config.maxShowsPerSession) return false;
    
    // Don't show if recently dismissed
    if (state.dismissedAt && (now - state.dismissedAt) < config.cooldownMs) return false;
    
    // Don't show if not enough time passed since last show
    if (state.lastShown && (now - state.lastShown) < config.intervalMs) return false;
    
    // Don't show if user was recently active
    if ((now - state.lastActivity) < config.activityThresholdMs) return false;
    
    return true;
  }, [state, config, isPageExcluded]);

  // Update user activity
  const updateActivity = useCallback(() => {
    const now = Date.now();
    setState(prev => {
      const newState = { ...prev, lastActivity: now };
      saveState(newState);
      return newState;
    });

    // Reset activity timeout
    if (activityTimeoutRef.current) {
      clearTimeout(activityTimeoutRef.current);
    }
    
    activityTimeoutRef.current = setTimeout(() => {
      // User has been inactive, check if we should show notification
      if (shouldShowNotification()) {
        showNotification();
      }
    }, config.activityThresholdMs);
  }, [config.activityThresholdMs, shouldShowNotification, saveState]);

  // Show notification
  const showNotification = useCallback(() => {
    if (!shouldShowNotification()) return;

    const now = Date.now();
    setState(prev => {
      const newState = {
        ...prev,
        isVisible: true,
        lastShown: now,
        showCount: prev.showCount + 1,
      };
      saveState(newState);
      return newState;
    });
  }, [shouldShowNotification, saveState]);

  // Dismiss notification
  const dismissNotification = useCallback(() => {
    const now = Date.now();
    setState(prev => {
      const newState = {
        ...prev,
        isVisible: false,
        dismissedAt: now,
        cooldownUntil: now + config.cooldownMs,
      };
      saveState(newState);
      return newState;
    });
  }, [config.cooldownMs, saveState]);

  // Handle WhatsApp link click
  const handleLinkClick = useCallback(() => {
    const now = Date.now();
    setState(prev => {
      const newState = {
        ...prev,
        isVisible: false,
        clickCount: prev.clickCount + 1,
        cooldownUntil: now + config.cooldownMs,
      };
      saveState(newState);
      return newState;
    });

    // Open WhatsApp link
    const link = `https://wa.me/${config.phoneNumber}?text=${encodeURIComponent(config.defaultMessage)}`;
    window.open(link, '_blank', 'noopener,noreferrer');
  }, [config.phoneNumber, config.defaultMessage, config.cooldownMs, saveState]);

  // Set up activity tracking
  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    const handleActivity = () => updateActivity();
    
    events.forEach(event => {
      document.addEventListener(event, handleActivity, { passive: true });
    });

    // Initial activity update
    updateActivity();

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
    };
  }, [updateActivity]);

  // Set up periodic check
  useEffect(() => {
    const checkInterval = Math.min(config.intervalMs / 4, 30000); // Check every 30s or quarter interval
    
    intervalRef.current = setInterval(() => {
      if (shouldShowNotification()) {
        showNotification();
      }
    }, checkInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [shouldShowNotification, showNotification, config.intervalMs]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (activityTimeoutRef.current) {
        clearTimeout(activityTimeoutRef.current);
      }
    };
  }, []);

  // Handle page navigation
  useEffect(() => {
    const handlePageChange = () => {
      if (isPageExcluded() && state.isVisible) {
        setState(prev => ({ ...prev, isVisible: false }));
      }
    };

    // Listen for navigation events
    window.addEventListener('popstate', handlePageChange);
    
    // Check current page
    handlePageChange();

    return () => {
      window.removeEventListener('popstate', handlePageChange);
    };
  }, [isPageExcluded, state.isVisible]);

  // Manual controls for testing/debugging
  const forceShow = useCallback(() => {
    setState(prev => ({ ...prev, isVisible: true }));
  }, []);

  const forceHide = useCallback(() => {
    setState(prev => ({ ...prev, isVisible: false }));
  }, []);

  const resetState = useCallback(() => {
    const initialState: NotificationState = {
      isVisible: false,
      lastShown: 0,
      dismissedAt: null,
      clickCount: 0,
      showCount: 0,
      lastActivity: Date.now(),
      cooldownUntil: 0,
    };
    setState(initialState);
    saveState(initialState);
  }, [saveState]);

  return {
    // State
    isVisible: state.isVisible,
    showCount: state.showCount,
    clickCount: state.clickCount,
    
    // Actions
    dismiss: dismissNotification,
    handleLinkClick,
    
    // Config
    config,
    
    // Debug/testing
    forceShow,
    forceHide,
    resetState,
    
    // Analytics
    onAnalytics,
  };
};