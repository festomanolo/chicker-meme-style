// Unit tests for WhatsApp notification system
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { WhatsAppNotification } from '@/components/notifications/WhatsAppNotification';
import { renderHook, act } from '@testing-library/react';
import { useWhatsAppNotification } from '@/hooks/useWhatsAppNotification';
import { NotificationConfig } from '@/types/notification';

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

// Mock window.open
Object.defineProperty(window, 'open', {
  value: jest.fn(),
});

describe('WhatsAppNotification', () => {
  const mockConfig: NotificationConfig = {
    intervalMs: 120000,
    cooldownMs: 1200000,
    activityThresholdMs: 30000,
    maxShowsPerSession: 3,
    excludedPages: ['/settings'],
    phoneNumber: '1234567890',
    defaultMessage: 'Test message',
    enableAnalytics: true,
  };

  const mockProps = {
    isVisible: true,
    onDismiss: jest.fn(),
    onLinkClick: jest.fn(),
    config: mockConfig,
    onAnalytics: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render notification when visible', () => {
    render(<WhatsAppNotification {...mockProps} />);
    
    expect(screen.getByText('Need Help?')).toBeInTheDocument();
    expect(screen.getByText('Chat with us on WhatsApp')).toBeInTheDocument();
    expect(screen.getByText('Chat on WhatsApp')).toBeInTheDocument();
  });

  it('should not render when not visible', () => {
    render(<WhatsAppNotification {...mockProps} isVisible={false} />);
    
    expect(screen.queryByText('Need Help?')).not.toBeInTheDocument();
  });

  it('should call onDismiss when dismiss button clicked', async () => {
    const user = userEvent.setup();
    render(<WhatsAppNotification {...mockProps} />);
    
    const dismissButton = screen.getByLabelText('Dismiss notification');
    await user.click(dismissButton);
    
    expect(mockProps.onDismiss).toHaveBeenCalled();
  });

  it('should call onLinkClick when WhatsApp button clicked', async () => {
    const user = userEvent.setup();
    render(<WhatsAppNotification {...mockProps} />);
    
    const whatsappButton = screen.getByText('Chat on WhatsApp');
    await user.click(whatsappButton);
    
    expect(mockProps.onLinkClick).toHaveBeenCalled();
  });

  it('should track analytics events', async () => {
    const user = userEvent.setup();
    render(<WhatsAppNotification {...mockProps} />);
    
    // Should track show event on mount
    await waitFor(() => {
      expect(mockProps.onAnalytics).toHaveBeenCalledWith(
        expect.objectContaining({ event: 'show' })
      );
    });

    // Should track dismiss event
    const dismissButton = screen.getByLabelText('Dismiss notification');
    await user.click(dismissButton);
    
    expect(mockProps.onAnalytics).toHaveBeenCalledWith(
      expect.objectContaining({ event: 'dismiss' })
    );
  });

  it('should track click and link_opened events', async () => {
    const user = userEvent.setup();
    render(<WhatsAppNotification {...mockProps} />);
    
    const whatsappButton = screen.getByText('Chat on WhatsApp');
    await user.click(whatsappButton);
    
    expect(mockProps.onAnalytics).toHaveBeenCalledWith(
      expect.objectContaining({ event: 'click' })
    );

    // Should track link_opened after delay
    await waitFor(() => {
      expect(mockProps.onAnalytics).toHaveBeenCalledWith(
        expect.objectContaining({ event: 'link_opened' })
      );
    }, { timeout: 200 });
  });

  it('should not track analytics when disabled', () => {
    const configWithoutAnalytics = { ...mockConfig, enableAnalytics: false };
    render(
      <WhatsAppNotification 
        {...mockProps} 
        config={configWithoutAnalytics}
      />
    );
    
    expect(mockProps.onAnalytics).not.toHaveBeenCalled();
  });

  it('should have proper accessibility attributes', () => {
    render(<WhatsAppNotification {...mockProps} />);
    
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-labelledby', 'whatsapp-notification-title');
    expect(dialog).toHaveAttribute('aria-describedby', 'whatsapp-notification-description');
    
    expect(screen.getByLabelText('Dismiss notification')).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const { container } = render(
      <WhatsAppNotification {...mockProps} className="custom-notification" />
    );
    
    expect(container.firstChild).toHaveClass('custom-notification');
  });

  it('should show online status indicator', () => {
    render(<WhatsAppNotification {...mockProps} />);
    
    expect(screen.getByText('Online')).toBeInTheDocument();
    expect(screen.getByText('Usually replies instantly')).toBeInTheDocument();
  });
});

describe('useWhatsAppNotification', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);
    
    // Mock current time
    jest.spyOn(Date, 'now').mockReturnValue(1000000);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useWhatsAppNotification());
    
    expect(result.current.isVisible).toBe(false);
    expect(result.current.showCount).toBe(0);
    expect(result.current.clickCount).toBe(0);
  });

  it('should load state from localStorage', () => {
    const savedState = {
      lastShown: 500000,
      dismissedAt: null,
      clickCount: 2,
      showCount: 1,
      cooldownUntil: 0,
    };
    
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(savedState));
    
    const { result } = renderHook(() => useWhatsAppNotification());
    
    expect(result.current.clickCount).toBe(2);
    expect(result.current.showCount).toBe(1);
  });

  it('should handle localStorage errors gracefully', () => {
    mockLocalStorage.getItem.mockImplementation(() => {
      throw new Error('Storage error');
    });
    
    const { result } = renderHook(() => useWhatsAppNotification());
    
    expect(result.current.isVisible).toBe(false);
  });

  it('should save state to localStorage', () => {
    const { result } = renderHook(() => useWhatsAppNotification());
    
    act(() => {
      result.current.dismiss();
    });
    
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      'whatsapp_notification_state',
      expect.stringContaining('dismissedAt')
    );
  });

  it('should handle link click and open WhatsApp', () => {
    const { result } = renderHook(() => useWhatsAppNotification());
    
    act(() => {
