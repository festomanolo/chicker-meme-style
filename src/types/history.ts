// History and undo system type definitions
import { LayerElement } from './layer';

export interface HistoryEntry {
  id: string;
  timestamp: number;
  action: HistoryAction;
  description: string;
  state: CanvasState;
  compressed?: boolean;
}

export interface CanvasState {
  layers: LayerElement[];
  selectedIds: string[];
  canvasSettings: {
    zoom: number;
    panX: number;
    panY: number;
    width: number;
    height: number;
  };
  metadata?: {
    version: string;
    checksum?: string;
  };
}

export interface HistoryAction {
  type: HistoryActionType;
  elementId?: string;
  elementIds?: string[];
  data?: any;
  previousData?: any;
}

export type HistoryActionType =
  | 'layer_add'
  | 'layer_remove'
  | 'layer_update'
  | 'layer_reorder'
  | 'layer_duplicate'
  | 'layer_group'
  | 'layer_ungroup'
  | 'transform_update'
  | 'crop_apply'
  | 'color_change'
  | 'visibility_toggle'
  | 'lock_toggle'
  | 'canvas_update'
  | 'bulk_update'
  | 'import_state'
  | 'reset_canvas';

export interface HistoryManagerConfig {
  maxEntries: number;
  compressionThreshold: number;
  compressionRatio: number;
  enableCompression: boolean;
  enableChecksums: boolean;
  debounceMs: number;
}

export interface HistoryStats {
  totalEntries: number;
  compressedEntries: number;
  memoryUsage: number;
  oldestEntry?: number;
  newestEntry?: number;
}

export interface UndoRedoResult {
  success: boolean;
  state?: CanvasState;
  error?: string;
  description?: string;
}

export interface HistorySnapshot {
  entries: HistoryEntry[];
  currentIndex: number;
  stats: HistoryStats;
  config: HistoryManagerConfig;
}