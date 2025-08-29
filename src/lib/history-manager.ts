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
      compressedEntries: compressedCount,
      memoryUsage,
      oldestEntry: this.entries.length > 0 ? this.entries[0].timestamp : undefined,
      newestEntry: this.entries.length > 0 ? this.entries[this.entries.length - 1].timestamp : undefined,
    };
  }

  /**
   * Clear all history
   */
  clear(): void {
    this.entries = [];
    this.currentIndex = -1;
    this.clearDebounce();
  }

  /**
   * Get history snapshot for serialization
   */
  getSnapshot(): HistorySnapshot {
    return {
      entries: this.entries.map(entry => ({ ...entry })),
      currentIndex: this.currentIndex,
      stats: this.getStats(),
      config: { ...this.config },
    };
  }

  /**
   * Restore from history snapshot
   */
  restoreSnapshot(snapshot: HistorySnapshot): void {
    this.entries = snapshot.entries.map(entry => ({ ...entry }));
    this.currentIndex = snapshot.currentIndex;
    this.config = { ...snapshot.config };
  }

  /**
   * Get recent history entries for display
   */
  getRecentEntries(count: number = 10): HistoryEntry[] {
    const startIndex = Math.max(0, this.currentIndex - count + 1);
    return this.entries.slice(startIndex, this.currentIndex + 1);
  }

  /**
   * Compress old history entries to save memory
   */
  compressHistory(): void {
    if (!this.config.enableCompression) return;

    const threshold = this.config.compressionThreshold;
    if (this.entries.length <= threshold) return;

    const compressCount = Math.floor(this.entries.length * this.config.compressionRatio);
    
    for (let i = 0; i < compressCount; i++) {
      if (!this.entries[i].compressed) {
        this.entries[i] = this.compressEntry(this.entries[i]);
      }
    }
  }

  /**
   * Validate state integrity
   */
  validateState(state: CanvasState): boolean {
    try {
      // Basic validation
      if (!state.layers || !Array.isArray(state.layers)) return false;
      if (!state.selectedIds || !Array.isArray(state.selectedIds)) return false;
      if (!state.canvasSettings) return false;

      // Validate layers
      for (const layer of state.layers) {
        if (!layer.id || typeof layer.id !== 'string') return false;
        if (!layer.name || typeof layer.name !== 'string') return false;
        if (!layer.type || typeof layer.type !== 'string') return false;
      }

      // Validate canvas settings
      const { canvasSettings } = state;
      if (typeof canvasSettings.zoom !== 'number') return false;
      if (typeof canvasSettings.panX !== 'number') return false;
      if (typeof canvasSettings.panY !== 'number') return false;

      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Calculate checksum for state
   */
  calculateChecksum(state: CanvasState): string {
    if (!this.config.enableChecksums) return '';
    
    try {
      const stateString = JSON.stringify(state, this.getSerializationReplacer());
      return this.simpleHash(stateString);
    } catch (error) {
      return '';
    }
  }

  /**
   * Private methods
   */

  private commitEntry(entry: HistoryEntry): void {
    // Remove any entries after current index (when adding after undo)
    if (this.currentIndex < this.entries.length - 1) {
      this.entries = this.entries.slice(0, this.currentIndex + 1);
    }

    // Add checksum if enabled
    if (this.config.enableChecksums) {
      entry.state.metadata = {
        ...entry.state.metadata,
        checksum: this.calculateChecksum(entry.state),
      };
    }

    // Add entry
    this.entries.push(entry);
    this.currentIndex++;

    // Maintain max entries limit
    if (this.entries.length > this.config.maxEntries) {
      const removeCount = this.entries.length - this.config.maxEntries;
      this.entries.splice(0, removeCount);
      this.currentIndex -= removeCount;
    }

    // Compress old entries if needed
    this.compressHistory();
  }

  private shouldDebounce(action: HistoryAction): boolean {
    const debounceActions: HistoryActionType[] = [
      'transform_update',
      'color_change',
      'canvas_update',
    ];
    
    return debounceActions.includes(action.type);
  }

  private handleDebouncedEntry(entry: HistoryEntry): void {
    this.pendingEntry = entry;
    
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    this.debounceTimer = setTimeout(() => {
      if (this.pendingEntry) {
        this.commitEntry(this.pendingEntry);
        this.pendingEntry = null;
      }
      this.debounceTimer = null;
    }, this.config.debounceMs);
  }

  private clearDebounce(): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }
    this.pendingEntry = null;
  }

  private generateId(): string {
    return `history_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateDescription(action: HistoryAction): string {
    const descriptions: Record<HistoryActionType, string> = {
      layer_add: 'Add layer',
      layer_remove: 'Remove layer',
      layer_update: 'Update layer',
      layer_reorder: 'Reorder layers',
      layer_duplicate: 'Duplicate layer',
      layer_group: 'Group layers',
      layer_ungroup: 'Ungroup layers',
      transform_update: 'Transform element',
      crop_apply: 'Apply crop',
      color_change: 'Change color',
      visibility_toggle: 'Toggle visibility',
      lock_toggle: 'Toggle lock',
      canvas_update: 'Update canvas',
      bulk_update: 'Bulk update',
      import_state: 'Import state',
      reset_canvas: 'Reset canvas',
    };

    let description = descriptions[action.type] || 'Unknown action';
    
    if (action.elementId) {
      description += ` (${action.elementId})`;
    } else if (action.elementIds && action.elementIds.length > 0) {
      description += ` (${action.elementIds.length} items)`;
    }

    return description;
  }

  private cloneState(state: CanvasState): CanvasState {
    try {
      return JSON.parse(JSON.stringify(state, this.getSerializationReplacer()));
    } catch (error) {
      throw new Error('Failed to clone state: ' + error);
    }
  }

  private getSerializationReplacer() {
    return (key: string, value: any) => {
      // Handle circular references and non-serializable values
      if (typeof value === 'function') return undefined;
      if (value instanceof HTMLElement) return undefined;
      if (value instanceof Event) return undefined;
      return value;
    };
  }

  private compressEntry(entry: HistoryEntry): HistoryEntry {
    const compressed: HistoryEntry = {
      ...entry,
      compressed: true,
      state: {
        ...entry.state,
        layers: entry.state.layers.map(layer => ({
          id: layer.id,
          name: layer.name,
          type: layer.type,
          visible: layer.visible,
          locked: layer.locked,
