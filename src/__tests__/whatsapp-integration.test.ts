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

    it('should return web link for desktop devices', () => {
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        writable: true,
      });
      
      const link = WhatsAppIntegration.getOptimalLink(mockConfig);
      expect(link).toContain('web.whatsapp.com');
    });
  });

  describe('openWhatsApp', () => {
    it('should open WhatsApp link in new window', () => {
      const mockOpen = jest.fn().mockReturnValue({});
      window.open = mockOpen;
      
      WhatsAppIntegration.openWhatsApp(mockConfig);
      
      expect(mockOpen).toHaveBeenCalledWith(
        expect.stringContaining('wa.me'),
        '_blank',
        'noopener,noreferrer'
      );
    });

    it('should fallback to location.href if popup blocked', () => {
      const mockOpen = jest.fn().mockReturnValue(null);
      window.open = mockOpen;
      
      const originalLocation = window.location;
      delete (window as any).location;
      window.location = { ...originalLocation, href: '' } as any;
      
      WhatsAppIntegration.openWhatsApp(mockConfig);
      
      expect(window.location.href).toContain('wa.me');
      
      // Restore location
      window.location = originalLocation;
    });
  });

  describe('validatePhoneNumber', () => {
    it('should validate correct phone numbers', () => {
      const result = WhatsAppIntegration.validatePhoneNumber('1234567890');
      
      expect(result.isValid).toBe(true);
      expect(result.formatted).toBe('(123) 456-7890');
    });

    it('should validate phone numbers with country code', () => {
      const result = WhatsAppIntegration.validatePhoneNumber('11234567890');
      
      expect(result.isValid).toBe(true);
      expect(result.formatted).toBe('+1 (123) 456-7890');
    });

    it('should reject empty phone numbers', () => {
      const result = WhatsAppIntegration.validatePhoneNumber('');
      
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Phone number is required');
    });

    it('should reject short phone numbers', () => {
      const result = WhatsAppIntegration.validatePhoneNumber('123');
      
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Phone number too short');
    });

    it('should reject long phone numbers', () => {
      const result = WhatsAppIntegration.validatePhoneNumber('1234567890123456');
      
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Phone number too long');
    });
  });

  describe('formatPhoneNumber', () => {
    it('should format 10-digit US numbers', () => {
      const formatted = WhatsAppIntegration.formatPhoneNumber('1234567890');
      expect(formatted).toBe('(123) 456-7890');
    });

    it('should format 11-digit US numbers with country code', () => {
      const formatted = WhatsAppIntegration.formatPhoneNumber('11234567890');
      expect(formatted).toBe('+1 (123) 456-7890');
    });

    it('should format international numbers', () => {
      const formatted = WhatsAppIntegration.formatPhoneNumber('441234567890');
      expect(formatted).toBe('+44 1234567890');
    });

    it('should handle numbers with non-digits', () => {
      const formatted = WhatsAppIntegration.formatPhoneNumber('+1 (234) 567-8900');
      expect(formatted).toBe('+1 (234) 567-8900');
    });
  });

  describe('getMessageTemplates', () => {
    it('should return predefined message templates', () => {
      const templates = WhatsAppIntegration.getMessageTemplates();
      
      expect(templates.support).toBeDefined();
      expect(templates.question).toBeDefined();
      expect(templates.feedback).toBeDefined();
      expect(templates.custom).toBeDefined();
      expect(templates.order).toBeDefined();
      expect(templates.technical).toBeDefined();
    });
  });

  describe('createPersonalizedMessage', () => {
    it('should create personalized message with user name', () => {
      const message = WhatsAppIntegration.createPersonalizedMessage(
        'I need help.',
        { userName: 'John' }
      );
      
      expect(message).toBe('Hi, I\'m John. I need help.');
    });

    it('should add project name', () => {
      const message = WhatsAppIntegration.createPersonalizedMessage(
        'I need help.',
        { projectName: 'My Project' }
      );
      
      expect(message).toBe('I need help. I\'m working on "My Project".');
    });

    it('should add page URL', () => {
      const message = WhatsAppIntegration.createPersonalizedMessage(
        'I need help.',
        { pageUrl: 'https://example.com/page' }
      );
      
      expect(message).toContain('Page: https://example.com/page');
    });

    it('should add timestamp', () => {
      const timestamp = Date.now();
      const message = WhatsAppIntegration.createPersonalizedMessage(
        'I need help.',
        { timestamp }
      );
      
      expect(message).toContain('Time:');
    });

    it('should combine all context', () => {
      const message = WhatsAppIntegration.createPersonalizedMessage(
        'I need help.',
        {
          userName: 'John',
          projectName: 'My Project',
          pageUrl: 'https://example.com',
          timestamp: Date.now(),
        }
      );
      
      expect(message).toContain('Hi, I\'m John');
      expect(message).toContain('My Project');
      expect(message).toContain('Page:');
      expect(message).toContain('Time:');
    });
  });

  describe('trackInteraction', () => {
    it('should track with Google Analytics if available', () => {
      const mockGtag = jest.fn();
      (window as any).gtag = mockGtag;
      
      WhatsAppIntegration.trackInteraction('link_clicked', { test: 'data' });
      
      expect(mockGtag).toHaveBeenCalledWith('event', 'whatsapp_interaction', {
        action: 'link_clicked',
        test: 'data',
      });
      
      delete (window as any).gtag;
    });

    it('should track with custom analytics if available', () => {
      const mockTrack = jest.fn();
      (window as any).analytics = { track: mockTrack };
      
      WhatsAppIntegration.trackInteraction('chat_opened', { test: 'data' });
      
      expect(mockTrack).toHaveBeenCalledWith('WhatsApp Interaction', {
        action: 'chat_opened',
        timestamp: expect.any(Number),
        test: 'data',
      });
      
      delete (window as any).analytics;
    });

    it('should handle missing analytics gracefully', () => {
      expect(() => {
        WhatsAppIntegration.trackInteraction('link_generated');
      }).not.toThrow();
    });
  });
});