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
    const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${message}`;
    window.open(whatsappUrl, '_blank');
    handleDismiss();
  };

  if (!isVisible || shouldExclude) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-top-2 duration-500">
      <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-2xl max-w-md mx-4">
        <div className="flex items-center gap-3 p-4">
          {/* WhatsApp Icon */}
          <div className="flex-shrink-0 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
            <MessageCircle className="h-5 w-5 text-white" />
          </div>
          
          {/* Message */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 leading-relaxed">
              Share with us what vibe you want to express, and we'll respond as quick as possible on WhatsApp.
            </p>
          </div>
          
          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              onClick={handleWhatsAppClick}
              size="sm"
              className="bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1.5 h-auto rounded-lg"
            >
              WhatsApp
            </Button>
            <Button
              onClick={handleDismiss}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};