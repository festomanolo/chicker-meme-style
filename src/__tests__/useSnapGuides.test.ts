// Unit tests for useSnapGuides hook
import { renderHook, act } from '@testing-library/react';
import { useSnapGuides } from '@/hooks/useSnapGuides';
import { Point, Rect } from '@/types/transform';

const mockElements = [
  {
    id: 'element-1',
    x: 100,
    y: 100,
    width: 200,
    height: 150,
    visible: true,
    locked: false,
  },
  {
    id: 'element-2',
    x: 400,
    y: 200,
    width: 100,
    height: 100,
    visible: true,
    locked: false,
  },
  {
    id: 'element-3',
    x: 50,
    y: 50,
    width: 80,
    height: 80,
    visible: false, // Should be excluded
    locked: false,
  },
  {
    id: 'element-4',
    x: 600,
    y: 300,
    width: 120,
    height: 90,
    visible: true,
    locked: true, // Should be excluded
  },
];

const mockCanvasSize = { width: 800, height: 600 };
const mockMockupBounds: Rect = { x: 200, y: 150, width: 400, height: 300 };

describe('useSnapGuides', () => {
  it('should initialize with empty guides', () => {
    const { result } = renderHook(() => useSnapGuides());

    expect(result.current.snapGuides).toEqual([]);
    expect(result.current.temporaryGuides).toEqual([]);
    expect(result.current.showGrid).toBe(false);
  });

  it('should generate canvas center guides', () => {
    const { result } = renderHook(() => useSnapGuides());

    act(() => {
      result.current.generateGuides([], mockCanvasSize);
    });

    const centerXGuide = result.current.snapGuides.find(
      g => g.type === 'center' && g.axis === 'x'
    );
    const centerYGuide = result.current.snapGuides.find(
      g => g.type === 'center' && g.axis === 'y'
    );

    expect(centerXGuide).toBeDefined();
    expect(centerXGuide!.position).toBe(400); // 800 / 2
    expect(centerYGuide).toBeDefined();
    expect(centerYGuide!.position).toBe(300); // 600 / 2
  });

  it('should generate mockup guides when mockup bounds provided', () => {
    const { result } = renderHook(() => useSnapGuides());

    act(() => {
      result.current.generateGuides([], mockCanvasSize, mockMockupBounds);
    });

    const mockupCenterXGuide = result.current.snapGuides.find(
      g => g.type === 'mockup' && g.axis === 'x' && g.position === 400 // 200 + 400/2
    );
    const mockupCenterYGuide = result.current.snapGuides.find(
      g => g.type === 'mockup' && g.axis === 'y' && g.position === 300 // 150 + 300/2
    );

    expect(mockupCenterXGuide).toBeDefined();
    expect(mockupCenterYGuide).toBeDefined();
  });

  it('should generate element guides for visible, unlocked elements', () => {
    const { result } = renderHook(() => useSnapGuides());

    act(() => {
      result.current.generateGuides(mockElements, mockCanvasSize);
    });

    // Should have guides for element-1 and element-2 only
    const element1Guides = result.current.snapGuides.filter(
      g => g.elementId === 'element-1'
    );
    const element2Guides = result.current.snapGuides.filter(
      g => g.elementId === 'element-2'
    );
    const element3Guides = result.current.snapGuides.filter(
      g => g.elementId === 'element-3'
    );
    const element4Guides = result.current.snapGuides.filter(
      g => g.elementId === 'element-4'
    );

    expect(element1Guides.length).toBeGreaterThan(0);
    expect(element2Guides.length).toBeGreaterThan(0);
    expect(element3Guides.length).toBe(0); // Invisible
    expect(element4Guides.length).toBe(0); // Locked
  });

  it('should generate grid guides when enabled', () => {
    const { result } = renderHook(() => 
      useSnapGuides({ enableGridSnap: true, gridSize: 50 })
    );

    act(() => {
      result.current.generateGuides([], mockCanvasSize);
    });

    const gridGuides = result.current.snapGuides.filter(g => g.type === 'grid');
    expect(gridGuides.length).toBeGreaterThan(0);

    // Should have grid guides at 50px intervals
    const gridXGuides = gridGuides.filter(g => g.axis === 'x');
    const gridYGuides = gridGuides.filter(g => g.axis === 'y');

    expect(gridXGuides.some(g => g.position === 50)).toBe(true);
    expect(gridXGuides.some(g => g.position === 100)).toBe(true);
    expect(gridYGuides.some(g => g.position === 50)).toBe(true);
    expect(gridYGuides.some(g => g.position === 100)).toBe(true);
  });

  it('should snap to nearest guide within threshold', () => {
    const { result } = renderHook(() => useSnapGuides({ snapThreshold: 15 }));

    act(() => {
      result.current.generateGuides(mockElements, mockCanvasSize);
    });

    const position: Point = { x: 405, y: 295 }; // Close to canvas center (400, 300)
    const snapResult = result.current.snapToGuides(position);

    expect(snapResult.snapped).toBe(true);
    expect(snapResult.position.x).toBe(400);
    expect(snapResult.position.y).toBe(300);
    expect(snapResult.guides.length).toBeGreaterThan(0);
  });

  it('should not snap when distance exceeds threshold', () => {
    const { result } = renderHook(() => useSnapGuides({ snapThreshold: 5 }));

    act(() => {
      result.current.generateGuides(mockElements, mockCanvasSize);
    });

    const position: Point = { x: 410, y: 310 }; // Too far from canvas center
    const snapResult = result.current.snapToGuides(position);

    expect(snapResult.snapped).toBe(false);
    expect(snapResult.position).toEqual(position);
  });

  it('should exclude guides from specified element', () => {
    const { result } = renderHook(() => useSnapGuides());

    act(() => {
      result.current.generateGuides(mockElements, mockCanvasSize);
    });

    // Position close to element-1 center (200, 175)
    const position: Point = { x: 205, y: 180 };
    const snapResult = result.current.snapToGuides(position, 'element-1');

    // Should not snap to element-1's guides, but might snap to others
    const element1Guides = snapResult.guides.filter(g => g.elementId === 'element-1');
    expect(element1Guides.length).toBe(0);
  });

  it('should create temporary guides for visual feedback', () => {
    const { result } = renderHook(() => useSnapGuides({ showTemporaryGuides: true }));

    act(() => {
      result.current.generateGuides(mockElements, mockCanvasSize);
    });

    const position: Point = { x: 405, y: 295 };
    
    act(() => {
      result.current.snapToGuides(position);
    });

    expect(result.current.temporaryGuides.length).toBeGreaterThan(0);
    expect(result.current.temporaryGuides.every(g => g.temporary)).toBe(true);
  });

  it('should not create temporary guides when disabled', () => {
    const { result } = renderHook(() => useSnapGuides({ showTemporaryGuides: false }));

    act(() => {
      result.current.generateGuides(mockElements, mockCanvasSize);
    });

    const position: Point = { x: 405, y: 295 };
    
    act(() => {
      result.current.snapToGuides(position);
    });

    expect(result.current.temporaryGuides.length).toBe(0);
  });

  it('should clear temporary guides', () => {
    const { result } = renderHook(() => useSnapGuides({ showTemporaryGuides: true }));

    act(() => {
      result.current.generateGuides(mockElements, mockCanvasSize);
    });

    // Create temporary guides
    act(() => {
      result.current.snapToGuides({ x: 405, y: 295 });
    });

    expect(result.current.temporaryGuides.length).toBeGreaterThan(0);

    // Clear temporary guides
    act(() => {
      result.current.clearTemporaryGuides();
    });

    expect(result.current.temporaryGuides.length).toBe(0);
  });

  it('should toggle grid visibility', () => {
    const { result } = renderHook(() => useSnapGuides());

    expect(result.current.showGrid).toBe(false);

    act(() => {
      result.current.setShowGrid(true);
    });

    expect(result.current.showGrid).toBe(true);

    act(() => {
      result.current.setShowGrid(false);
    });

    expect(result.current.showGrid).toBe(false);
  });

  it('should sort guides by priority', () => {
    const { result } = renderHook(() => useSnapGuides());

    act(() => {
      result.current.generateGuides(mockElements, mockCanvasSize, mockMockupBounds);
    });

    const guides = result.current.snapGuides;
    
    // Check that guides are sorted by priority
    for (let i = 1; i < guides.length; i++) {
      expect(guides[i].priority).toBeGreaterThanOrEqual(guides[i - 1].priority);
    }
  });

  it('should handle snapping to both X and Y axes simultaneously', () => {
    const { result } = renderHook(() => useSnapGuides({ snapThreshold: 15 }));

    act(() => {
      result.current.generateGuides(mockElements, mockCanvasSize);
    });

    const position: Point = { x: 405, y: 295 }; // Close to canvas center on both axes
    const snapResult = result.current.snapToGuides(position);

    expect(snapResult.snapped).toBe(true);
