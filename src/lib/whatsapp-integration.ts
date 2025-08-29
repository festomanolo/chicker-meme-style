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
