// Analytics service for WhatsApp notifications
import { NotificationAnalytics } from '@/types/notification';

export interface AnalyticsConfig {
  enableGoogleAnalytics: boolean;
  enableCustomAnalytics: boolean;
  enableConsoleLogging: boolean;
  apiEndpoint?: string;
  apiKey?: string;
}

export class NotificationAnalyticsService {
  private config: AnalyticsConfig;
  private sessionId: string;
  private eventQueue: NotificationAnalytics[] = [];
  private flushTimer: NodeJS.Timeout | null = null;

  constructor(config: Partial<AnalyticsConfig> = {}) {
    this.config = {
      enableGoogleAnalytics: true,
      enableCustomAnalytics: false,
      enableConsoleLogging: process.env.NODE_ENV === 'development',
      ...config,
    };

    this.sessionId = this.generateSessionId();
    this.setupEventListeners();
  }

  /**
   * Track notification event
   */
  track(event: NotificationAnalytics): void {
    // Add session context
    const enrichedEvent = {
      ...event,
      sessionId: this.sessionId,
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      referrer: document.referrer,
    };

    // Console logging for development
    if (this.config.enableConsoleLogging) {
      console.log('📱 WhatsApp Notification Event:', enrichedEvent);
    }

    // Google Analytics
    if (this.config.enableGoogleAnalytics) {
      this.trackGoogleAnalytics(enrichedEvent);
    }

    // Custom analytics
    if (this.config.enableCustomAnalytics) {
      this.queueCustomEvent(enrichedEvent);
    }
  }

  /**
   * Track with Google Analytics
   */
  private trackGoogleAnalytics(event: NotificationAnalytics): void {
    if (typeof window === 'undefined') return;

    // Google Analytics 4
    if ((window as any).gtag) {
      (window as any).gtag('event', 'whatsapp_notification', {
        event_category: 'engagement',
        event_label: event.event,
        custom_parameters: {
          notification_event: event.event,
          show_count: event.showCount,
          page_url: event.pageUrl,
          session_id: event.sessionId,
        },
      });
    }

    // Universal Analytics (legacy)
    if ((window as any).ga) {
      (window as any).ga('send', 'event', {
        eventCategory: 'WhatsApp Notification',
        eventAction: event.event,
        eventLabel: event.pageUrl,
        eventValue: event.showCount,
      });
    }
  }

  /**
   * Queue event for custom analytics
   */
  private queueCustomEvent(event: NotificationAnalytics): void {
    this.eventQueue.push(event);

    // Flush queue periodically
    if (!this.flushTimer) {
      this.flushTimer = setTimeout(() => {
        this.flushEventQueue();
      }, 5000); // Flush every 5 seconds
    }
  }

  /**
   * Flush event queue to custom analytics endpoint
   */
  private async flushEventQueue(): void {
    if (this.eventQueue.length === 0) return;

    const events = [...this.eventQueue];
    this.eventQueue = [];
    this.flushTimer = null;

    if (!this.config.apiEndpoint) return;

    try {
      await fetch(this.config.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.config.apiKey && { 'Authorization': `Bearer ${this.config.apiKey}` }),
        },
        body: JSON.stringify({
          events,
          timestamp: Date.now(),
        }),
      });
    } catch (error) {
      console.warn('Failed to send analytics events:', error);
      // Re-queue events for retry
      this.eventQueue.unshift(...events);
    }
  }

  /**
   * Generate session ID
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Setup event listeners for page lifecycle
   */
  private setupEventListeners(): void {
    // Flush events before page unload
    window.addEventListener('beforeunload', () => {
      if (this.eventQueue.length > 0) {
        this.flushEventQueue();
      }
    });

    // Flush events when page becomes hidden
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden' && this.eventQueue.length > 0) {
        this.flushEventQueue();
      }
    });
  }

  /**
   * Get analytics summary
   */
  getAnalyticsSummary(): {
    sessionId: string;
    queuedEvents: number;
    config: AnalyticsConfig;
  } {
    return {
      sessionId: this.sessionId,
      queuedEvents: this.eventQueue.length,
      config: this.config,
    };
  }

  /**
   * Clear event queue
   */
  clearQueue(): void {
    this.eventQueue = [];
    if (this.flushTimer) {
      clearTimeout(this.flushTimer);
      this.flushTimer = null;
    }
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<AnalyticsConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
}

// Singleton instance
let analyticsInstance: NotificationAnalyticsService | null = null;

/**
 * Get or create analytics service instance
 */
export const getAnalyticsService = (config?: Partial<AnalyticsConfig>): NotificationAnalyticsService => {
  if (!analyticsInstance) {
    analyticsInstance = new NotificationAnalyticsService(config);
  }
  return analyticsInstance;
};

/**
 * Track notification event (convenience function)
 */
export const trackNotificationEvent = (event: NotificationAnalytics): void => {
  const service = getAnalyticsService();
  service.track(event);
};

/**
 * Analytics event builders
 */
export const AnalyticsEventBuilders = {
  show: (pageUrl: string, showCount: number, sessionId: string): NotificationAnalytics => ({
    event: 'show',
    timestamp: Date.now(),
    sessionId,
    pageUrl,
    showCount,
    metadata: {
      trigger: 'automatic',
    },
  }),

  click: (pageUrl: string, showCount: number, sessionId: string): NotificationAnalytics => ({
    event: 'click',
    timestamp: Date.now(),
    sessionId,
    pageUrl,
    showCount,
    metadata: {
      action: 'whatsapp_button_click',
    },
  }),

  dismiss: (pageUrl: string, showCount: number, sessionId: string, method: 'button' | 'timeout' = 'button'): NotificationAnalytics => ({
    event: 'dismiss',
    timestamp: Date.now(),
    sessionId,
    pageUrl,
    showCount,
    metadata: {
      dismissMethod: method,
    },
  }),

  linkOpened: (pageUrl: string, showCount: number, sessionId: string, phoneNumber: string): NotificationAnalytics => ({
    event: 'link_opened',
    timestamp: Date.now(),
    sessionId,
    pageUrl,
    showCount,
    metadata: {
      phoneNumber: phoneNumber.replace(/\d/g, '*'), // Mask phone number for privacy
      platform: /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
    },
  }),
};