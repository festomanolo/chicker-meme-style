// History management service with undo/redo functionality
import { 
  HistoryEntry, 
  CanvasState, 
  HistoryAction, 
  HistoryManagerConfig, 
  HistoryStats, 
  UndoRedoResult,
  HistorySnapshot,
  HistoryActionType
} from '@/types/history';
import { LayerElement } from '@/types/layer';

export class HistoryManager {
  private entries: HistoryEntry[] = [];
  private currentIndex: number = -1;
  private config: HistoryManagerConfig;
  private debounceTimer: NodeJS.Timeout | null = null;
  private pendingEntry: HistoryEntry | null = null;

  constructor(config: Partial<HistoryManagerConfig> = {}) {
    this.config = {
      maxEntries: 50,
      compressionThreshold: 20,
      compressionRatio: 0.5,
      enableCompression: true,
      enableChecksums: true,
      debounceMs: 300,
      ...config,
    };
  }

  /**
   * Add a new history entry
   */
  addEntry(action: HistoryAction, state: CanvasState, description?: string): void {
    const entry: HistoryEntry = {
      id: this.generateId(),
      timestamp: Date.now(),
      action,
      description: description || this.generateDescription(action),
      state: this.cloneState(state),
    };

    // Handle debouncing for rapid changes
    if (this.shouldDebounce(action)) {
      this.handleDebouncedEntry(entry);
      return;
    }

    this.commitEntry(entry);
  }

  /**
   * Undo the last action
   */
  undo(): UndoRedoResult {
    if (!this.canUndo()) {
      return {
        success: false,
        error: 'Nothing to undo',
      };
    }

    this.currentIndex--;
    const entry = this.entries[this.currentIndex];
    
    return {
      success: true,
      state: this.cloneState(entry.state),
      description: `Undo: ${entry.description}`,
    };
  }

  /**
   * Redo the next action
   */
  redo(): UndoRedoResult {
    if (!this.canRedo()) {
      return {
        success: false,
        error: 'Nothing to redo',
      };
    }

    this.currentIndex++;
    const entry = this.entries[this.currentIndex];
    
    return {
      success: true,
      state: this.cloneState(entry.state),
      description: `Redo: ${entry.description}`,
    };
  }

  /**
   * Check if undo is possible
   */
  canUndo(): boolean {
    return this.currentIndex > 0;
  }

  /**
   * Check if redo is possible
   */
  canRedo(): boolean {
    return this.currentIndex < this.entries.length - 1;
  }

  /**
   * Get current history stats
   */
  getStats(): HistoryStats {
    const compressedCount = this.entries.filter(e => e.compressed).length;
    const memoryUsage = this.calculateMemoryUsage();
    
    return {
      totalEntries: this.entries.length,
