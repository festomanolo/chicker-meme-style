// Unit tests for useCanvasLayout hook
import { renderHook, act } from '@testing-library/react';
import { useCanvasLayout } from '@/hooks/useCanvasLayout';

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

// Mock requestAnimationFrame
global.requestAnimationFrame = jest.fn((cb) => {
  setTimeout(cb, 16);
  return 1;
});

global.cancelAnimationFrame = jest.fn();

describe('useCanvasLayout', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockWindowDimensions(1024, 768);
  });

  it('should initialize with default layout state', () => {
    const { result } = renderHook(() => useCanvasLayout());

    expect(result.current.layoutState.canvasWidth).toBeGreaterThan(0);
    expect(result.current.layoutState.canvasHeight).toBeGreaterThan(0);
    expect(result.current.layoutState.zoom).toBe(1);
    expect(result.current.layoutState.panX).toBe(0);
    expect(result.current.layoutState.panY).toBe(0);
    expect(result.current.layoutState.isAnimating).toBe(false);
  });

  it('should initialize with custom config', () => {
    const config = {
      panelWidth: 400,
      panelPosition: 'left' as const,
      minCanvasWidth: 500,
    };

    const { result } = renderHook(() => useCanvasLayout({ config }));

    expect(result.current.layoutState).toBeDefined();
  });

  it('should handle panel opening', () => {
    const { result } = renderHook(() => useCanvasLayout());

    act(() => {
      result.current.openPanel();
    });

    expect(result.current.isPanelOpen).toBe(true);
  });

  it('should handle panel closing', () => {
    const { result } = renderHook(() => useCanvasLayout());

    act(() => {
      result.current.openPanel();
    });

    expect(result.current.isPanelOpen).toBe(true);

    act(() => {
      result.current.closePanel();
    });

    expect(result.current.isPanelOpen).toBe(false);
  });

  it('should toggle panel state', () => {
    const { result } = renderHook(() => useCanvasLayout());

    expect(result.current.isPanelOpen).toBe(false);

    act(() => {
      result.current.togglePanel();
    });

    expect(result.current.isPanelOpen).toBe(true);

    act(() => {
      result.current.togglePanel();
    });

    expect(result.current.isPanelOpen).toBe(false);
  });

  it('should update zoom level', () => {
    const { result } = renderHook(() => useCanvasLayout());

    act(() => {
      result.current.setZoom(2, false);
    });

    expect(result.current.layoutState.zoom).toBe(2);
  });

  it('should update pan position', () => {
    const { result } = renderHook(() => useCanvasLayout());

    act(() => {
      result.current.setPan(100, 50, false);
    });

    expect(result.current.layoutState.panX).toBe(100);
    expect(result.current.layoutState.panY).toBe(50);
  });

  it('should reset view to defaults', () => {
    const { result } = renderHook(() => useCanvasLayout());

    // Change zoom and pan
    act(() => {
      result.current.setZoom(2, false);
      result.current.setPan(100, 50, false);
    });

    expect(result.current.layoutState.zoom).toBe(2);
    expect(result.current.layoutState.panX).toBe(100);

    // Reset view
    act(() => {
      result.current.resetView(false);
    });

    expect(result.current.layoutState.zoom).toBe(1);
    expect(result.current.layoutState.panX).toBe(0);
    expect(result.current.layoutState.panY).toBe(0);
  });

  it('should fit content to canvas', () => {
    const { result } = renderHook(() => useCanvasLayout());

    act(() => {
      result.current.fitToCanvas(false);
    });

    // Should calculate optimal zoom and centering
    expect(result.current.layoutState.zoom).toBeGreaterThan(0);
  });

  it('should generate canvas styles', () => {
    const { result } = renderHook(() => useCanvasLayout());

    const styles = result.current.getCanvasStyles();

    expect(styles.position).toBe('absolute');
    expect(styles.transform).toContain('translate');
    expect(styles.transform).toContain('scale');
    expect(styles.transformOrigin).toBe('0 0');
  });

  it('should generate panel overlay styles', () => {
    const { result } = renderHook(() => useCanvasLayout());

    const styles = result.current.getPanelOverlayStyles();

    expect(styles.position).toBe('fixed');
    expect(styles.top).toBe(0);
    expect(styles.height).toBe('100vh');
  });

  it('should handle viewport resize', () => {
    const { result } = renderHook(() => useCanvasLayout());

    const initialWidth = result.current.layoutState.canvasWidth;

    // Change window size
    mockWindowDimensions(800, 600);
    
    // Trigger resize event
    act(() => {
      window.dispatchEvent(new Event('resize'));
    });

    // Layout should update
    expect(result.current.viewportDimensions.width).toBe(800);
    expect(result.current.viewportDimensions.height).toBe(600);
  });

  it('should call onLayoutChange callback', () => {
    const onLayoutChange = jest.fn();
    const { result } = renderHook(() => useCanvasLayout({ onLayoutChange }));

    act(() => {
      result.current.setZoom(2, false);
    });

    expect(onLayoutChange).toHaveBeenCalled();
  });

  it('should handle animation state', () => {
    const { result } = renderHook(() => useCanvasLayout());

    act(() => {
      result.current.setZoom(2, true); // animated
    });

    // Should initially set animating to true
    // Note: In real usage, animation would complete asynchronously
  });

  it('should respect minimum canvas dimensions', () => {
    const config = {
      minCanvasWidth: 500,
      minCanvasHeight: 400,
    };

    mockWindowDimensions(300, 200); // Smaller than minimum

    const { result } = renderHook(() => useCanvasLayout({ config }));
