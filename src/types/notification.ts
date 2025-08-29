// WhatsApp notification system type definitions
export interface NotificationState {
  isVisible: boolean;
  lastShown: number;
  dismissedAt: number | null;
  clickCount: number;
  showCount: number;
  lastActivity: number;
  cooldownUntil: number;
}

export interface NotificationConfig {
  intervalMs: number;
  cooldownMs: number;
  activityThresholdMs: number;
  maxShowsPerSession: number;
  excludedPages: string[];
  phoneNumber: string;
  defaultMessage: string;
  enableAnalytics: boolean;
}

export interface NotificationAnalytics {
  event: 'show' | 'click' | 'dismiss' | 'link_opened';
  timestamp: number;
  sessionId: string;
  pageUrl: string;
  showCount: number;
  metadata?: Record<string, any>;
}

export interface WhatsAppLinkConfig {
  phoneNumber: string;
  message: string;
  source?: string;
}