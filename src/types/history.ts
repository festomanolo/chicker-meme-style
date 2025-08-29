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
