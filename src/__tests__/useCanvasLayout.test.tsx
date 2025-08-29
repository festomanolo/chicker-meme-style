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

