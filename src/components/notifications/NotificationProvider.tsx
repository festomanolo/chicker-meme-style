// Provider component for WhatsApp notifications with analytics
import React, { createContext, useContext, useEffect } from 'react';
import { WhatsAppNotification } from './WhatsAppNotification';
import { useWhatsAppNotification } from '@/hooks/useWhatsAppNotification';
import { getAnalyticsService, AnalyticsEventBuilders } from '@/lib/notification-analytics';
import { WhatsAppIntegration } from '@/lib/whatsapp-integration';
import { NotificationConfig, NotificationAnalytics } from '@/types/notification';

interface NotificationContextValue {
  isVisible: boolean;
  showCount: number;
  clickCount: number;
  forceShow: () => void;
  forceHide: () => void;
  resetState: () => void;
  config: NotificationConfig;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

interface NotificationProviderProps {
  children: React.ReactNode;
  config?: Partial<NotificationConfig>;
  enableAnalytics?: boolean;
  analyticsConfig?: {
    enableGoogleAnalytics?: boolean;
    enableCustomAnalytics?: boolean;
    apiEndpoint?: string;
    apiKey?: string;
  };
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
  config = {},
  enableAnalytics = true,
  analyticsConfig = {},
}) => {
  // Initialize analytics service
  const analyticsService = enableAnalytics ? getAnalyticsService(analyticsConfig) : null;

  // Handle analytics events
  const handleAnalytics = (event: NotificationAnalytics) => {
    if (!analyticsService) return;

    analyticsService.track(event);

    // Track WhatsApp integration events
