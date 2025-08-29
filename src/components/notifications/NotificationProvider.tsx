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
    if (event.event === 'click') {
      WhatsAppIntegration.trackInteraction('link_clicked', {
        sessionId: event.sessionId,
        pageUrl: event.pageUrl,
        showCount: event.showCount,
      });
    }

    if (event.event === 'link_opened') {
      WhatsAppIntegration.trackInteraction('chat_opened', {
        sessionId: event.sessionId,
        pageUrl: event.pageUrl,
        phoneNumber: config.phoneNumber,
      });
    }
  };

  // Initialize notification hook
  const notification = useWhatsAppNotification({
    config,
    onAnalytics: handleAnalytics,
  });

  // Enhanced link click handler with analytics
  const handleLinkClick = () => {
    const linkConfig = {
      phoneNumber: notification.config.phoneNumber,
      message: notification.config.defaultMessage,
      source: 'notification_popup',
    };

    // Track link generation
    WhatsAppIntegration.trackInteraction('link_generated', {
      phoneNumber: notification.config.phoneNumber,
      source: 'notification_popup',
    });

    // Open WhatsApp
    WhatsAppIntegration.openWhatsApp(linkConfig);

    // Call original handler
    notification.handleLinkClick();
  };

  // Context value
  const contextValue: NotificationContextValue = {
    isVisible: notification.isVisible,
    showCount: notification.showCount,
    clickCount: notification.clickCount,
