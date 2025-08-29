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
