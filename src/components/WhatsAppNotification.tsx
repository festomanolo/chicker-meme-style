import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, MessageCircle } from 'lucide-react';
import { useLocation } from 'react-router-dom';

interface WhatsAppNotificationProps {
  whatsappNumber?: string;
  excludePaths?: string[];
}

export const WhatsAppNotification: React.FC<WhatsAppNotificationProps> = ({
  whatsappNumber = '+255123456789', // Default WhatsApp number
  excludePaths = ['/account', '/settings']
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const location = useLocation();

  // Check if current path should be excluded
  const shouldExclude = excludePaths.some(path => 
    location.pathname.startsWith(path)
  );

  // Reset activity timer on user interaction
  useEffect(() => {
    const resetActivity = () => setLastActivity(Date.now());
    
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, resetActivity, true);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, resetActivity, true);
      });
    };
  }, []);

  // Show notification every 2 minutes or on route change
  useEffect(() => {
    if (shouldExclude || isDismissed) return;

    const checkActivity = () => {
      const timeSinceActivity = Date.now() - lastActivity;
      const twoMinutes = 2 * 60 * 1000; // 2 minutes in milliseconds
      
      if (timeSinceActivity >= twoMinutes) {
        setIsVisible(true);
      }
    };

    // Show immediately on route change (after a short delay)
    const routeChangeTimer = setTimeout(() => {
      if (!isDismissed) {
        setIsVisible(true);
      }
    }, 3000);

    // Check every 30 seconds
    const activityInterval = setInterval(checkActivity, 30000);

    return () => {
      clearTimeout(routeChangeTimer);
      clearInterval(activityInterval);
    };
  }, [lastActivity, shouldExclude, isDismissed, location.pathname]);

  // Auto-hide after 10 seconds
  useEffect(() => {
    if (isVisible) {
      const autoHideTimer = setTimeout(() => {
        setIsVisible(false);
      }, 10000);

      return () => clearTimeout(autoHideTimer);
    }
  }, [isVisible]);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    // Reset dismissed state after 10 minutes
    setTimeout(() => setIsDismissed(false), 10 * 60 * 1000);
  };

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(
      "Hi! I'd like to share what vibe I want to express with my t-shirt design. Can you help me?"
    );
