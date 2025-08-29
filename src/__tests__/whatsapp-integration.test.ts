// Unit tests for WhatsApp integration utilities
import { WhatsAppIntegration } from '@/lib/whatsapp-integration';
import { WhatsAppLinkConfig } from '@/types/notification';

// Mock window.open
Object.defineProperty(window, 'open', {
  value: jest.fn(),
});

// Mock navigator.userAgent
Object.defineProperty(navigator, 'userAgent', {
  value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  writable: true,
});

describe('WhatsAppIntegration', () => {
  const mockConfig: WhatsAppLinkConfig = {
    phoneNumber: '+1 (234) 567-8900',
    message: 'Hello, I need help!',
    source: 'test',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generateLink', () => {
    it('should generate correct WhatsApp link', () => {
      const link = WhatsAppIntegration.generateLink(mockConfig);
      
      expect(link).toBe('https://wa.me/12345678900?text=Hello%2C%20I%20need%20help!%0A%0A(Source%3A%20test)');
    });

    it('should handle phone number with special characters', () => {
      const config = {
        ...mockConfig,
        phoneNumber: '+1-234-567-8900',
      };
      
      const link = WhatsAppIntegration.generateLink(config);
      expect(link).toContain('12345678900');
    });

    it('should encode message properly', () => {
      const config = {
        ...mockConfig,
        message: 'Hello & welcome! How are you?',
      };
      
      const link = WhatsAppIntegration.generateLink(config);
      expect(link).toContain(encodeURIComponent('Hello & welcome! How are you?'));
    });

    it('should work without source', () => {
      const config = {
        phoneNumber: '1234567890',
        message: 'Test message',
      };
      
      const link = WhatsAppIntegration.generateLink(config);
      expect(link).toBe('https://wa.me/1234567890?text=Test%20message');
    });
  });

  describe('generateWebLink', () => {
    it('should generate correct WhatsApp Web link', () => {
      const link = WhatsAppIntegration.generateWebLink(mockConfig);
      
      expect(link).toBe('https://web.whatsapp.com/send?phone=12345678900&text=Hello%2C%20I%20need%20help!');
    });
  });

  describe('isMobileDevice', () => {
    it('should detect mobile devices', () => {
      // Mock mobile user agent
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
        writable: true,
      });
      
      expect(WhatsAppIntegration.isMobileDevice()).toBe(true);
    });

    it('should detect desktop devices', () => {
      // Mock desktop user agent
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        writable: true,
      });
      
      expect(WhatsAppIntegration.isMobileDevice()).toBe(false);
    });
  });

  describe('getOptimalLink', () => {
    it('should return mobile link for mobile devices', () => {
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
        writable: true,
      });
      
      const link = WhatsAppIntegration.getOptimalLink(mockConfig);
      expect(link).toContain('wa.me');
    });
