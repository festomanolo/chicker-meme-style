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
    <div
      className={cn(
        'fixed bottom-4 right-4 z-50 max-w-sm',
        'transform transition-all duration-300 ease-out',
        isAnimating ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-2 opacity-95 scale-98',
        className
      )}
      role="dialog"
      aria-labelledby="whatsapp-notification-title"
      aria-describedby="whatsapp-notification-description"
    >
      {/* Notification card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 border-b border-green-100 dark:border-green-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 
                id="whatsapp-notification-title"
                className="font-semibold text-gray-900 dark:text-gray-100 text-sm"
              >
                Need Help?
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Chat with us on WhatsApp
              </p>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="h-8 w-8 p-0 hover:bg-green-100 dark:hover:bg-green-800/50"
            aria-label="Dismiss notification"
          >
            <X className="h-4 w-4" />
          </Button>
