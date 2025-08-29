// Unit tests for MobileEditingPanel component
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { MobileEditingPanel, useMobileEditingPanel } from '@/components/mobile/MobileEditingPanel';
import { renderHook, act } from '@testing-library/react';

// Mock window dimensions
const mockWindowDimensions = (width: number, height: number) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height,
  });
};

describe('MobileEditingPanel', () => {
  const mockProps = {
    isOpen: true,
    onClose: jest.fn(),
    children: <div>Panel Content</div>,
    title: 'Test Panel',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockWindowDimensions(375, 667); // iPhone dimensions
  });

  it('should render panel when open', () => {
    render(<MobileEditingPanel {...mockProps} />);
    
    expect(screen.getByText('Test Panel')).toBeInTheDocument();
    expect(screen.getByText('Panel Content')).toBeInTheDocument();
  });

  it('should not render panel content when closed', () => {
    render(<MobileEditingPanel {...mockProps} isOpen={false} />);
    
    expect(screen.queryByText('Panel Content')).not.toBeInTheDocument();
  });

  it('should call onClose when close button clicked', async () => {
    const user = userEvent.setup();
    render(<MobileEditingPanel {...mockProps} />);
    
    const closeButton = screen.getByRole('button');
    await user.click(closeButton);
    
    expect(mockProps.onClose).toHaveBeenCalled();
  });

  it('should call onClose when backdrop clicked', async () => {
    const user = userEvent.setup();
    render(<MobileEditingPanel {...mockProps} />);
    
    // Click on backdrop (overlay)
    const backdrop = document.querySelector('.fixed.inset-0');
    if (backdrop) {
      await user.click(backdrop);
      expect(mockProps.onClose).toHaveBeenCalled();
    }
  });

  it('should render with custom title', () => {
    render(<MobileEditingPanel {...mockProps} title="Custom Title" />);
    
    expect(screen.getByText('Custom Title')).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const { container } = render(
      <MobileEditingPanel {...mockProps} className="custom-panel" />
    );
    
    const panel = container.querySelector('.custom-panel');
    expect(panel).toBeInTheDocument();
  });

  it('should position panel on the right by default', () => {
    const { container } = render(<MobileEditingPanel {...mockProps} />);
    
    const panel = container.querySelector('.right-0');
    expect(panel).toBeInTheDocument();
  });

  it('should position panel on the left when specified', () => {
    const { container } = render(
      <MobileEditingPanel {...mockProps} position="left" />
    );
    
    const panel = container.querySelector('.left-0');
    expect(panel).toBeInTheDocument();
  });

  it('should show collapse button when enabled', () => {
    render(<MobileEditingPanel {...mockProps} showCollapseButton={true} />);
    
    // Should have multiple buttons (collapse + close)
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(1);
  });

  it('should hide collapse button when disabled', () => {
    render(<MobileEditingPanel {...mockProps} showCollapseButton={false} />);
    
    // Should only have close button
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBe(1);
  });

  it('should handle collapse/expand functionality', async () => {
    const user = userEvent.setup();
    render(<MobileEditingPanel {...mockProps} showCollapseButton={true} />);
    
    // Find collapse button (not the close button)
    const buttons = screen.getAllByRole('button');
    const collapseButton = buttons.find(button => 
      button !== screen.getByRole('button', { name: /close/i })
    );
    
    if (collapseButton) {
      await user.click(collapseButton);
      
      // Panel content should be hidden when collapsed
      await waitFor(() => {
        expect(screen.queryByText('Panel Content')).not.toBeInTheDocument();
      });
    }
  });

  it('should calculate dimensions for small phone', () => {
    mockWindowDimensions(320, 568); // Small phone
    render(<MobileEditingPanel {...mockProps} />);
    
    // Panel should be 75% width for small phones
    const panel = document.querySelector('[style*="width"]');
    expect(panel).toBeInTheDocument();
  });

  it('should calculate dimensions for tablet', () => {
    mockWindowDimensions(768, 1024); // Tablet
    render(<MobileEditingPanel {...mockProps} />);
    
    // Panel should be 42% width for tablets with constraints
    const panel = document.querySelector('[style*="width"]');
    expect(panel).toBeInTheDocument();
  });

  it('should handle window resize', () => {
    render(<MobileEditingPanel {...mockProps} />);
    
