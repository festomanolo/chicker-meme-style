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

