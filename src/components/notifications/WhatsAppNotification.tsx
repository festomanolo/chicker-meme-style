// WhatsApp notification component with macOS-style design
import React, { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { X, MessageCircle, ExternalLink } from 'lucide-react';
import { NotificationConfig, NotificationAnalytics } from '@/types/notification';

interface WhatsAppNotificationProps {
  isVisible: boolean;
  onDismiss: () => void;
  onLinkClick: () => void;
  config: NotificationConfig;
  onAnalytics?: (event: NotificationAnalytics) => void;
  className?: string;
}

export const WhatsAppNotification: React.FC<WhatsAppNotificationProps> = ({
  isVisible,
  onDismiss,
  onLinkClick,
  config,
  onAnalytics,
  className,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showCount, setShowCount] = useState(0);

  // Generate session ID
  const sessionId = React.useMemo(() => 
    `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, 
    []
  );

  // Track analytics
  const trackEvent = useCallback((event: NotificationAnalytics['event'], metadata?: Record<string, any>) => {
    if (!config.enableAnalytics || !onAnalytics) return;

    onAnalytics({
      event,
      timestamp: Date.now(),
      sessionId,
      pageUrl: window.location.href,
      showCount,
      metadata,
    });
  }, [config.enableAnalytics, onAnalytics, sessionId, showCount]);

  // Handle show animation
  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      setShowCount(prev => prev + 1);
      trackEvent('show');
      
      // Remove animation class after animation completes
      const timer = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isVisible, trackEvent]);

  // Handle dismiss
  const handleDismiss = useCallback(() => {
    trackEvent('dismiss');
    onDismiss();
  }, [trackEvent, onDismiss]);

  // Handle WhatsApp link click
  const handleLinkClick = useCallback(() => {
    trackEvent('click');
    onLinkClick();
    
    // Track when link is actually opened
    setTimeout(() => {
      trackEvent('link_opened');
    }, 100);
  }, [trackEvent, onLinkClick]);

  // Generate WhatsApp link
  const whatsappLink = `https://wa.me/${config.phoneNumber}?text=${encodeURIComponent(config.defaultMessage)}`;

  if (!isVisible) return null;

  return (
