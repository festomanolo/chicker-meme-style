// React hook for canvas history integration
import { useCallback, useEffect, useRef, useState } from 'react';
import { HistoryManager } from '@/lib/history-manager';
import { CanvasState, UndoRedoResult } from '@/types/history';
import { LayerElement } from '@/types/layer';

interface UseCanvasHistoryOptions {
  maxEntries?: number;
  debounceMs?: number;
  enableCompression?: boolean;
  enableKeyboardShortcuts?: boolean;
}

interface CanvasHistoryHook {
  canUndo: boolean;
  canRedo: boolean;
  undo: () => UndoRedoResult;
  redo: () => UndoRedoResult;
  saveState: (state: CanvasState, description?: string) => void;
  addLayer: (layer: LayerElement, state: CanvasState) => void;
  removeLayer: (layerId: string, state: CanvasState) => void;
  updateLayer: (layerId: string, updates: Partial<LayerElement>, state: CanvasState) => void;
  transformElement: (elementId: string, state: CanvasState) => void;
  cropElement: (elementId: string, state: CanvasState) => void;
  changeColor: (elementId: string, state: CanvasState) => void;
  bulkUpdate: (elementIds: string[], state: CanvasState) => void;
  clear: () => void;
  getStats: () => any;
}

export const useCanvasHistory = (options: UseCanvasHistoryOptions = {}): CanvasHistoryHook => {
  const {
    maxEntries = 50,
    debounceMs = 300,
    enableCompression = true,
    enableKeyboardShortcuts = true,
  } = options;

  const historyManagerRef = useRef<HistoryManager>();
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  // Initialize history manager
  if (!historyManagerRef.current) {
    historyManagerRef.current = new HistoryManager({
      maxEntries,
      debounceMs,
      enableCompression,
      enableChecksums: true,
    });
  }

  const updateUndoRedoState = useCallback(() => {
    if (historyManagerRef.current) {
      setCanUndo(historyManagerRef.current.canUndo());
      setCanRedo(historyManagerRef.current.canRedo());
    }
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    if (!enableKeyboardShortcuts) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key === 'z') {
        e.preventDefault();
        undo();
      } else if (
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'z') ||
        ((e.ctrlKey || e.metaKey) && e.key === 'y')
      ) {
        e.preventDefault();
        redo();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [enableKeyboardShortcuts]);

  const undo = useCallback((): UndoRedoResult => {
    if (!historyManagerRef.current) {
      return { success: false, error: 'History manager not initialized' };
    }

    const result = historyManagerRef.current.undo();
    updateUndoRedoState();
    return result;
  }, [updateUndoRedoState]);

  const redo = useCallback((): UndoRedoResult => {
    if (!historyManagerRef.current) {
      return { success: false, error: 'History manager not initialized' };
    }

    const result = historyManagerRef.current.redo();
    updateUndoRedoState();
    return result;
  }, [updateUndoRedoState]);

  const saveState = useCallback((state: CanvasState, description?: string) => {
    if (!historyManagerRef.current) return;

    historyManagerRef.current.addEntry(
      { type: 'canvas_update' },
      state,
      description
    );
    updateUndoRedoState();
  }, [updateUndoRedoState]);

  const addLayer = useCallback((layer: LayerElement, state: CanvasState) => {
    if (!historyManagerRef.current) return;

    historyManagerRef.current.addLayerAction(layer, state);
    updateUndoRedoState();
  }, [updateUndoRedoState]);

  const removeLayer = useCallback((layerId: string, state: CanvasState) => {
    if (!historyManagerRef.current) return;

    historyManagerRef.current.removeLayerAction(layerId, state);
    updateUndoRedoState();
  }, [updateUndoRedoState]);

  const updateLayer = useCallback((layerId: string, updates: Partial<LayerElement>, state: CanvasState) => {
    if (!historyManagerRef.current) return;

    historyManagerRef.current.updateLayerAction(layerId, updates, state);
    updateUndoRedoState();
  }, [updateUndoRedoState]);

  const transformElement = useCallback((elementId: string, state: CanvasState) => {
    if (!historyManagerRef.current) return;

    historyManagerRef.current.transformAction(elementId, state);
    updateUndoRedoState();
  }, [updateUndoRedoState]);

  const cropElement = useCallback((elementId: string, state: CanvasState) => {
    if (!historyManagerRef.current) return;
