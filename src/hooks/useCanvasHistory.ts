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
