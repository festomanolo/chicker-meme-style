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
      result.current.removeLayer('layer-1', mockState);
    });

    expect(result.current.canUndo).toBe(true);
    expect(result.current.canRedo).toBe(false);
  });

  it('should handle updating layers in history', () => {
    const { result } = renderHook(() => useCanvasHistory());

    const updates = { name: 'Updated Layer', x: 200 };

    act(() => {
      result.current.updateLayer('layer-1', updates, mockState);
    });

    expect(result.current.canUndo).toBe(true);
    expect(result.current.canRedo).toBe(false);
  });

  it('should handle transform operations', () => {
    const { result } = renderHook(() => useCanvasHistory());

    act(() => {
      result.current.transformElement('layer-1', mockState);
    });

    expect(result.current.canUndo).toBe(true);
  });

  it('should handle crop operations', () => {
    const { result } = renderHook(() => useCanvasHistory());

    act(() => {
      result.current.cropElement('layer-1', mockState);
    });

    expect(result.current.canUndo).toBe(true);
  });

  it('should handle color change operations', () => {
    const { result } = renderHook(() => useCanvasHistory());

    act(() => {
      result.current.changeColor('layer-1', mockState);
    });

    expect(result.current.canUndo).toBe(true);
  });

  it('should handle bulk update operations', () => {
    const { result } = renderHook(() => useCanvasHistory());

    act(() => {
      result.current.bulkUpdate(['layer-1', 'layer-2'], mockState);
    });

    expect(result.current.canUndo).toBe(true);
  });

  it('should handle undo operations', () => {
    const { result } = renderHook(() => useCanvasHistory());

    // Add an entry first
    act(() => {
      result.current.addLayer(mockLayer, mockState);
    });

    expect(result.current.canUndo).toBe(true);

    // Perform undo
    let undoResult: any;
    act(() => {
      undoResult = result.current.undo();
    });

    expect(undoResult.success).toBe(true);
    expect(undoResult.state).toBeDefined();
    expect(result.current.canUndo).toBe(false);
    expect(result.current.canRedo).toBe(true);
  });

  it('should handle redo operations', () => {
    const { result } = renderHook(() => useCanvasHistory());

    // Add entry and undo
    act(() => {
      result.current.addLayer(mockLayer, mockState);
    });

    act(() => {
      result.current.undo();
    });

    expect(result.current.canRedo).toBe(true);

    // Perform redo
    let redoResult: any;
    act(() => {
      redoResult = result.current.redo();
    });

    expect(redoResult.success).toBe(true);
    expect(redoResult.state).toBeDefined();
    expect(result.current.canUndo).toBe(true);
    expect(result.current.canRedo).toBe(false);
  });

  it('should handle failed undo when nothing to undo', () => {
    const { result } = renderHook(() => useCanvasHistory());

    let undoResult: any;
    act(() => {
      undoResult = result.current.undo();
    });

    expect(undoResult.success).toBe(false);
    expect(undoResult.error).toBeDefined();
  });

  it('should handle failed redo when nothing to redo', () => {
    const { result } = renderHook(() => useCanvasHistory());

    let redoResult: any;
    act(() => {
      redoResult = result.current.redo();
    });

    expect(redoResult.success).toBe(false);
    expect(redoResult.error).toBeDefined();
  });

  it('should save arbitrary state', () => {
    const { result } = renderHook(() => useCanvasHistory());

    act(() => {
      result.current.saveState(mockState, 'Custom state save');
    });

    expect(result.current.canUndo).toBe(true);
  });

  it('should clear history', () => {
    const { result } = renderHook(() => useCanvasHistory());

    // Add some entries
    act(() => {
      result.current.addLayer(mockLayer, mockState);
      result.current.updateLayer('layer-1', { name: 'Updated' }, mockState);
    });

    expect(result.current.canUndo).toBe(true);

    // Clear history
    act(() => {
