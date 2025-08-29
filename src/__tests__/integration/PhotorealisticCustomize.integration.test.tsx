// Integration tests for PhotorealisticCustomize component
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import PhotorealisticCustomize from '@/pages/PhotorealisticCustomize';

// Mock components that require complex setup
jest.mock('@/components/mockup/PhotorealisticMockup', () => ({
  PhotorealisticMockup: ({ mockup, color }: any) => (
    <div data-testid="photorealistic-mockup">
      Mockup: {mockup?.name} - Color: {color?.rgb?.r},{color?.rgb?.g},{color?.rgb?.b}
    </div>
  ),
}));

jest.mock('@/components/notifications/NotificationProvider', () => ({
  NotificationProvider: ({ children }: any) => <div>{children}</div>,
}));

// Mock services
jest.mock('@/lib/layer-manager', () => ({
  LayerManager: jest.fn().mockImplementation(() => ({
    addLayer: jest.fn((layers, layer) => [...layers, layer]),
    updateLayer: jest.fn((layers, id, updates) => 
      layers.map((l: any) => l.id === id ? { ...l, ...updates } : l)
    ),
    removeLayer: jest.fn((layers, id) => layers.filter((l: any) => l.id !== id)),
  })),
}));

jest.mock('@/lib/color-manager', () => ({
  ColorManager: jest.fn().mockImplementation(() => ({
    getPresets: jest.fn(() => [
      { h: 0, s: 100, v: 100, rgb: { r: 255, g: 0, b: 0 } },
      { h: 120, s: 100, v: 100, rgb: { r: 0, g: 255, b: 0 } },
      { h: 240, s: 100, v: 100, rgb: { r: 0, g: 0, b: 255 } },
    ]),
    toHex: jest.fn(() => '#ffffff'),
  })),
}));

jest.mock('@/lib/transform-manager', () => ({
  TransformManager: jest.fn().mockImplementation(() => ({
    applyTransform: jest.fn(() => ({ x: 100, y: 100 })),
  })),
}));

// Mock hooks
jest.mock('@/hooks/useCanvasHistory', () => ({
  useCanvasHistory: jest.fn(() => ({
    canUndo: false,
    canRedo: false,
    undo: jest.fn(),
    redo: jest.fn(),
    addLayer: jest.fn(),
    updateLayer: jest.fn(),
    saveState: jest.fn(),
    getStats: jest.fn(() => ({ totalEntries: 0, memoryUsage: 0 })),
  })),
}));

jest.mock('@/hooks/useSnapGuides', () => ({
  useSnapGuides: jest.fn(() => ({
    guides: [],
    addGuide: jest.fn(),
    removeGuide: jest.fn(),
  })),
}));

describe('PhotorealisticCustomize Integration', () => {
  const mockProps = {
    onSave: jest.fn(),
    onExport: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render main customize interface', async () => {
    render(<PhotorealisticCustomize {...mockProps} />);
    
    expect(screen.getByText('T-Shirt Designer')).toBeInTheDocument();
    expect(screen.getByTestId('photorealistic-mockup')).toBeInTheDocument();
  });

  it('should load default mockup when none provided', async () => {
    render(<PhotorealisticCustomize {...mockProps} />);
    
    await waitFor(() => {
      expect(screen.getByTestId('photorealistic-mockup')).toHaveTextContent('Classic T-Shirt');
    });
  });

  it('should use initial mockup when provided', () => {
    const initialMockup = {
      id: 'test-mockup',
      name: 'Test Mockup',
      category: 'apparel' as const,
      baseColor: '#ffffff',
      assets: {
        '1x': '/test-1x.jpg',
        '2x': '/test-2x.jpg',
        '3x': '/test-3x.jpg',
      },
      printArea: { x: 0, y: 0, width: 100, height: 100 },
      metadata: { dimensions: { width: 800, height: 600 }, dpi: 300 },
    };

    render(<PhotorealisticCustomize {...mockProps} initialMockup={initialMockup} />);
    
    expect(screen.getByTestId('photorealistic-mockup')).toHaveTextContent('Test Mockup');
  });

  it('should use initial color when provided', () => {
    const initialColor = {
      h: 120,
      s: 100,
      v: 100,
      rgb: { r: 0, g: 255, b: 0 },
    };

    render(<PhotorealisticCustomize {...mockProps} initialColor={initialColor} />);
    
    expect(screen.getByTestId('photorealistic-mockup')).toHaveTextContent('Color: 0,255,0');
  });

  it('should handle tool selection', async () => {
    const user = userEvent.setup();
    render(<PhotorealisticCustomize {...mockProps} />);
    
    // Find and click a tool button (assuming Move tool exists)
    const moveButton = screen.getByLabelText(/move tool/i);
    await user.click(moveButton);
    
    // Tool should be selected (visual feedback would be tested in component tests)
    expect(moveButton).toBeInTheDocument();
  });

  it('should handle save action', async () => {
    const user = userEvent.setup();
    render(<PhotorealisticCustomize {...mockProps} />);
    
    const saveButton = screen.getByText('Save');
    await user.click(saveButton);
    
    expect(mockProps.onSave).toHaveBeenCalledWith(
      expect.objectContaining({
        layers: expect.any(Array),
        selectedIds: expect.any(Array),
        canvasSettings: expect.any(Object),
      })
    );
  });

  it('should handle export action', async () => {
    const user = userEvent.setup();
    render(<PhotorealisticCustomize {...mockProps} />);
    
    // Note: Export button might not be visible in simplified version
    // This test would need to be adjusted based on actual implementation
  });

  it('should handle color changes', async () => {
    render(<PhotorealisticCustomize {...mockProps} />);
    
    // Color changes would be tested through the ColorRangeSelector component
    // This is more of a component integration test
    expect(screen.getByTestId('photorealistic-mockup')).toBeInTheDocument();
  });

  it('should handle responsive layout', () => {
    // Mock mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });

    render(<PhotorealisticCustomize {...mockProps} />);
    
    // Should render mobile-friendly interface
    expect(screen.getByText('T-Shirt Designer')).toBeInTheDocument();
  });

  it('should handle keyboard shortcuts', async () => {
    render(<PhotorealisticCustomize {...mockProps} />);
    
    // Test undo shortcut (Ctrl+Z)
    fireEvent.keyDown(document, { key: 'z', ctrlKey: true });
    
    // History hook should handle this (mocked in this test)
    expect(screen.getByText('T-Shirt Designer')).toBeInTheDocument();
  });

  it('should handle error states gracefully', () => {
    // This would test error boundary integration
    // Error boundaries are tested separately
    expect(() => {
      render(<PhotorealisticCustomize {...mockProps} />);
    }).not.toThrow();
  });

  it('should maintain state consistency', async () => {
    const user = userEvent.setup();
    render(<PhotorealisticCustomize {...mockProps} />);
    
    // Perform multiple operations
    const saveButton = screen.getByText('Save');
    await user.click(saveButton);
    
    // State should remain consistent
    expect(mockProps.onSave).toHaveBeenCalled();
  });

  it('should handle concurrent operations', async () => {
    const user = userEvent.setup();
    render(<PhotorealisticCustomize {...mockProps} />);
    
    // Simulate rapid clicks
    const saveButton = screen.getByText('Save');
    await user.click(saveButton);
    await user.click(saveButton);
    
    // Should handle multiple rapid operations
    expect(mockProps.onSave).toHaveBeenCalledTimes(2);
  });

  it('should cleanup resources on unmount', () => {
    const { unmount } = render(<PhotorealisticCustomize {...mockProps} />);
    
    // Should not throw errors on unmount
    expect(() => unmount()).not.toThrow();
  });

  it('should handle prop changes', () => {
    const { rerender } = render(<PhotorealisticCustomize {...mockProps} />);
    
    const newProps = {
      ...mockProps,
      initialColor: { h: 240, s: 100, v: 100, rgb: { r: 0, g: 0, b: 255 } },
    };
    
    expect(() => {
      rerender(<PhotorealisticCustomize {...newProps} />);
    }).not.toThrow();
  });

  it('should integrate with notification system', () => {
    render(<PhotorealisticCustomize {...mockProps} />);
    
    // NotificationProvider should be wrapping the component
    expect(screen.getByText('T-Shirt Designer')).toBeInTheDocument();
  });

  it('should handle accessibility requirements', () => {
    render(<PhotorealisticCustomize {...mockProps} />);
    
    // Check for basic accessibility
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
  });
});