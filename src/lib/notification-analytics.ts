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
