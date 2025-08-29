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
