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
