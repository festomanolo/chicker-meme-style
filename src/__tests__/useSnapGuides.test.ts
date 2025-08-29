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
