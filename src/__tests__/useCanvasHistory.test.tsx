// Unit tests for useCanvasHistory hook
import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { useCanvasHistory } from '@/hooks/useCanvasHistory';
import { CanvasState } from '@/types/history';
import { LayerElement } from '@/types/layer';

const createMockCanvasState = (): CanvasState => ({
  layers: [
    {
      id: 'layer-1',
      name: 'Test Layer',
      type: 'text',
      visible: true,
      locked: false,
      opacity: 1,
      zIndex: 1,
      x: 100,
      y: 100,
      width: 200,
      height: 50,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
      content: 'Test content',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
  ],
  selectedIds: ['layer-1'],
  canvasSettings: {
    zoom: 1,
    panX: 0,
    panY: 0,
    width: 800,
    height: 600,
  },
});

const createMockLayer = (): LayerElement => ({
  id: 'new-layer',
  name: 'New Layer',
  type: 'image',
  visible: true,
  locked: false,
  opacity: 1,
  zIndex: 2,
  x: 150,
  y: 150,
  width: 100,
  height: 100,
  rotation: 0,
  scaleX: 1,
  scaleY: 1,
  imageUrl: '/test-image.jpg',
  createdAt: Date.now(),
  updatedAt: Date.now(),
});

describe('useCanvasHistory', () => {
  let mockState: CanvasState;
  let mockLayer: LayerElement;

  beforeEach(() => {
    mockState = createMockCanvasState();
    mockLayer = createMockLayer();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useCanvasHistory());

    expect(result.current.canUndo).toBe(false);
    expect(result.current.canRedo).toBe(false);
    expect(typeof result.current.undo).toBe('function');
    expect(typeof result.current.redo).toBe('function');
  });

  it('should initialize with custom options', () => {
    const options = {
      maxEntries: 25,
      debounceMs: 500,
      enableCompression: false,
    };

    const { result } = renderHook(() => useCanvasHistory(options));

    expect(result.current.getStats).toBeDefined();
  });

  it('should handle adding layers to history', () => {
    const { result } = renderHook(() => useCanvasHistory());

    act(() => {
      result.current.addLayer(mockLayer, mockState);
    });

    expect(result.current.canUndo).toBe(true);
    expect(result.current.canRedo).toBe(false);
  });

  it('should handle removing layers from history', () => {
    const { result } = renderHook(() => useCanvasHistory());

    act(() => {
