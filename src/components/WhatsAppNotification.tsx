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
