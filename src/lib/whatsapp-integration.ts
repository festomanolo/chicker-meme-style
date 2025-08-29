// WhatsApp integration utilities and link generation
import { WhatsAppLinkConfig } from '@/types/notification';

export class WhatsAppIntegration {
  private static readonly BASE_URL = 'https://wa.me';
  private static readonly WEB_URL = 'https://web.whatsapp.com/send';

  /**
   * Generate WhatsApp link for mobile/desktop
   */
  static generateLink(config: WhatsAppLinkConfig): string {
    const { phoneNumber, message, source } = config;
    
    // Clean phone number (remove non-digits)
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    
    // Encode message
    const encodedMessage = encodeURIComponent(message);
    
    // Add source tracking if provided
    const trackingMessage = source 
      ? `${message}\n\n(Source: ${source})`
      : message;
    
    const finalEncodedMessage = encodeURIComponent(trackingMessage);
    
    return `${this.BASE_URL}/${cleanNumber}?text=${finalEncodedMessage}`;
  }

  /**
   * Generate WhatsApp Web link (for desktop browsers)
   */
  static generateWebLink(config: WhatsAppLinkConfig): string {
    const { phoneNumber, message } = config;
    
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    const encodedMessage = encodeURIComponent(message);
    
    return `${this.WEB_URL}?phone=${cleanNumber}&text=${encodedMessage}`;
  }

  /**
   * Detect if user is on mobile device
   */
  static isMobileDevice(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  }

  /**
   * Get appropriate WhatsApp link based on device
   */
  static getOptimalLink(config: WhatsAppLinkConfig): string {
    return this.isMobileDevice() 
      ? this.generateLink(config)
      : this.generateWebLink(config);
  }

  /**
   * Open WhatsApp with optimal method
   */
  static openWhatsApp(config: WhatsAppLinkConfig): void {
    const link = this.getOptimalLink(config);
    
    // Try to open in new tab/window
    const newWindow = window.open(link, '_blank', 'noopener,noreferrer');
    
    // Fallback for popup blockers
    if (!newWindow) {
      window.location.href = link;
    }
  }

  /**
   * Validate phone number format
   */
  static validatePhoneNumber(phoneNumber: string): {
    isValid: boolean;
    formatted?: string;
    error?: string;
  } {
    const cleaned = phoneNumber.replace(/\D/g, '');
    
    if (cleaned.length === 0) {
      return { isValid: false, error: 'Phone number is required' };
    }
    
    if (cleaned.length < 10) {
      return { isValid: false, error: 'Phone number too short' };
    }
    
    if (cleaned.length > 15) {
      return { isValid: false, error: 'Phone number too long' };
    }
    
    // Format for display
    const formatted = this.formatPhoneNumber(cleaned);
    
    return { isValid: true, formatted };
  }

  /**
   * Format phone number for display
   */
  static formatPhoneNumber(phoneNumber: string): string {
    const cleaned = phoneNumber.replace(/\D/g, '');
    
    if (cleaned.length === 10) {
      // US format: (123) 456-7890
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    
    if (cleaned.length === 11 && cleaned.startsWith('1')) {
      // US with country code: +1 (123) 456-7890
      return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
    }
    
    // International format: +XX XXXXXXXXX
    if (cleaned.length > 10) {
      const countryCode = cleaned.slice(0, -10);
      const number = cleaned.slice(-10);
      return `+${countryCode} ${number}`;
    }
    
    return cleaned;
  }

  /**
   * Generate message templates
   */
  static getMessageTemplates(): Record<string, string> {
    return {
      support: 'Hi! I need help with my design project.',
      question: 'Hi! I have a question about your service.',
      feedback: 'Hi! I\'d like to share some feedback.',
      custom: 'Hi! I\'d like to get in touch.',
      order: 'Hi! I need help with my order.',
      technical: 'Hi! I\'m experiencing a technical issue.',
    };
  }

  /**
   * Create personalized message
   */
  static createPersonalizedMessage(
    template: string,
    context?: {
      userName?: string;
      projectName?: string;
      pageUrl?: string;
      timestamp?: number;
    }
  ): string {
    let message = template;
    
    if (context?.userName) {
      message = `Hi, I'm ${context.userName}. ${message}`;
    }
    
    if (context?.projectName) {
      message += ` I'm working on "${context.projectName}".`;
    }
    
    if (context?.pageUrl) {
      message += `\n\nPage: ${context.pageUrl}`;
    }
    
    if (context?.timestamp) {
      const date = new Date(context.timestamp).toLocaleString();
      message += `\nTime: ${date}`;
    }
    
    return message;
  }

  /**
   * Track WhatsApp interaction
   */
  static trackInteraction(
    action: 'link_generated' | 'link_clicked' | 'chat_opened',
    metadata?: Record<string, any>
  ): void {
    // This would integrate with your analytics service
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'whatsapp_interaction', {
        action,
        ...metadata,
      });
    }
    
    // Custom analytics
    if (typeof window !== 'undefined' && (window as any).analytics) {
      (window as any).analytics.track('WhatsApp Interaction', {
        action,
        timestamp: Date.now(),
        ...metadata,
      });
    }
  }
}