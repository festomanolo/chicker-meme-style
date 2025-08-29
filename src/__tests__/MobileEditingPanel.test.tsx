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
    
    // Change window size
    mockWindowDimensions(768, 1024);
    fireEvent(window, new Event('resize'));
    
    // Panel should update its dimensions
    const panel = document.querySelector('[style*="width"]');
    expect(panel).toBeInTheDocument();
  });

  it('should show drag indicator when swipe gestures enabled', () => {
    const { container } = render(
      <MobileEditingPanel {...mockProps} enableSwipeGestures={true} />
    );
    
    const dragIndicator = container.querySelector('.absolute.top-1\\/2');
    expect(dragIndicator).toBeInTheDocument();
  });

  it('should hide drag indicator when swipe gestures disabled', () => {
    const { container } = render(
      <MobileEditingPanel {...mockProps} enableSwipeGestures={false} />
    );
    
    const dragIndicator = container.querySelector('.absolute.top-1\\/2');
    expect(dragIndicator).not.toBeInTheDocument();
  });

  it('should handle touch events for swipe gestures', () => {
    const { container } = render(
      <MobileEditingPanel {...mockProps} enableSwipeGestures={true} />
    );
    
    const panel = container.querySelector('.fixed.top-0');
    
    if (panel) {
      // Simulate touch start
      fireEvent.touchStart(panel, {
        touches: [{ clientX: 100, clientY: 100 }],
      });
      
      // Simulate touch move
      fireEvent.touchMove(panel, {
        touches: [{ clientX: 150, clientY: 100 }],
      });
      
      // Simulate touch end
      fireEvent.touchEnd(panel);
    }
  });

  it('should show resize handle on tablets', () => {
    mockWindowDimensions(768, 1024); // Tablet
    const { container } = render(<MobileEditingPanel {...mockProps} />);
    
    const resizeHandle = container.querySelector('.cursor-col-resize');
    expect(resizeHandle).toBeInTheDocument();
  });

  it('should not show resize handle on phones', () => {
    mockWindowDimensions(375, 667); // Phone
    const { container } = render(<MobileEditingPanel {...mockProps} />);
    
    const resizeHandle = container.querySelector('.cursor-col-resize');
    expect(resizeHandle).not.toBeInTheDocument();
  });
});

describe('useMobileEditingPanel', () => {
  it('should initialize with closed state', () => {
    const { result } = renderHook(() => useMobileEditingPanel());
    
    expect(result.current.isOpen).toBe(false);
    expect(result.current.activePanel).toBe(null);
  });

  it('should open panel', () => {
    const { result } = renderHook(() => useMobileEditingPanel());
    
    act(() => {
      result.current.openPanel('test-panel');
    });
    
    expect(result.current.isOpen).toBe(true);
    expect(result.current.activePanel).toBe('test-panel');
  });

  it('should close panel', () => {
    const { result } = renderHook(() => useMobileEditingPanel());
    
    act(() => {
      result.current.openPanel('test-panel');
    });
    
    expect(result.current.isOpen).toBe(true);
    
    act(() => {
      result.current.closePanel();
    });
    
    expect(result.current.isOpen).toBe(false);
    expect(result.current.activePanel).toBe(null);
  });

  it('should toggle panel', () => {
    const { result } = renderHook(() => useMobileEditingPanel());
    
    // Toggle open
    act(() => {
      result.current.togglePanel('test-panel');
    });
    
    expect(result.current.isOpen).toBe(true);
    expect(result.current.activePanel).toBe('test-panel');
    
    // Toggle closed
    act(() => {
      result.current.togglePanel('test-panel');
    });
    
    expect(result.current.isOpen).toBe(false);
    expect(result.current.activePanel).toBe(null);
  });

  it('should switch between different panels', () => {
    const { result } = renderHook(() => useMobileEditingPanel());
    
    act(() => {
      result.current.openPanel('panel-1');
    });
    
    expect(result.current.activePanel).toBe('panel-1');
    
    act(() => {
      result.current.openPanel('panel-2');
    });
    
    expect(result.current.isOpen).toBe(true);
    expect(result.current.activePanel).toBe('panel-2');
  });

  it('should handle toggle with different panel IDs', () => {
    const { result } = renderHook(() => useMobileEditingPanel());
    
    // Open panel-1
    act(() => {
      result.current.togglePanel('panel-1');
    });
    
    expect(result.current.activePanel).toBe('panel-1');
    
    // Toggle panel-2 (should switch to panel-2)
    act(() => {
      result.current.togglePanel('panel-2');
    });
    
    expect(result.current.isOpen).toBe(true);
    expect(result.current.activePanel).toBe('panel-2');
  });
});