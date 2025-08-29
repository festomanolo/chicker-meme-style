// Unit tests for HistoryManager service
import { HistoryManager } from '@/lib/history-manager';
import { CanvasState, HistoryAction, HistoryManagerConfig } from '@/types/history';
import { LayerElement } from '@/types/layer';

const createMockCanvasState = (layerCount: number = 1): CanvasState => ({
  layers: Array.from({ length: layerCount }, (_, i) => ({
    id: `layer-${i}`,
    name: `Layer ${i}`,
    type: 'text' as const,
    visible: true,
    locked: false,
    opacity: 1,
    zIndex: i,
    x: i * 10,
    y: i * 10,
    width: 100,
    height: 50,
    rotation: 0,
    scaleX: 1,
    scaleY: 1,
    content: `Content ${i}`,
    createdAt: Date.now() - i * 1000,
    updatedAt: Date.now() - i * 1000,
  })),
  selectedIds: ['layer-0'],
  canvasSettings: {
    zoom: 1,
    panX: 0,
    panY: 0,
    width: 800,
    height: 600,
  },
});

const createMockAction = (type: string = 'layer_add'): HistoryAction => ({
  type: type as any,
  elementId: 'layer-0',
  data: { name: 'Test Layer' },
});

describe('HistoryManager', () => {
  let historyManager: HistoryManager;
  let mockState: CanvasState;

  beforeEach(() => {
    historyManager = new HistoryManager();
    mockState = createMockCanvasState();
  });

  describe('initialization', () => {
    it('should initialize with default config', () => {
      const manager = new HistoryManager();
      const stats = manager.getStats();
      
      expect(stats.totalEntries).toBe(0);
      expect(manager.canUndo()).toBe(false);
      expect(manager.canRedo()).toBe(false);
    });

    it('should initialize with custom config', () => {
      const config: Partial<HistoryManagerConfig> = {
        maxEntries: 25,
        enableCompression: false,
      };
      
      const manager = new HistoryManager(config);
      const snapshot = manager.getSnapshot();
      
      expect(snapshot.config.maxEntries).toBe(25);
      expect(snapshot.config.enableCompression).toBe(false);
    });
  });

  describe('addEntry', () => {
    it('should add a new history entry', () => {
      const action = createMockAction();
      historyManager.addEntry(action, mockState, 'Test action');
      
      const stats = historyManager.getStats();
      expect(stats.totalEntries).toBe(1);
      expect(historyManager.canUndo()).toBe(true);
      expect(historyManager.canRedo()).toBe(false);
    });

    it('should generate description when not provided', () => {
      const action = createMockAction('layer_add');
      historyManager.addEntry(action, mockState);
      
      const entries = historyManager.getRecentEntries(1);
      expect(entries[0].description).toContain('Add layer');
    });

    it('should maintain max entries limit', () => {
      const config: Partial<HistoryManagerConfig> = { maxEntries: 3 };
      const manager = new HistoryManager(config);
      
      // Add 5 entries
      for (let i = 0; i < 5; i++) {
        const action = createMockAction();
        const state = createMockCanvasState(i + 1);
        manager.addEntry(action, state, `Action ${i}`);
      }
      
      const stats = manager.getStats();
      expect(stats.totalEntries).toBe(3);
    });

    it('should clear redo history when adding after undo', () => {
      // Add 3 entries
      for (let i = 0; i < 3; i++) {
        historyManager.addEntry(createMockAction(), mockState, `Action ${i}`);
      }
      
      // Undo twice
      historyManager.undo();
      historyManager.undo();
      
      expect(historyManager.canRedo()).toBe(true);
      
      // Add new entry
      historyManager.addEntry(createMockAction(), mockState, 'New action');
      
      expect(historyManager.canRedo()).toBe(false);
    });
  });

  describe('undo', () => {
    it('should undo the last action', () => {
      historyManager.addEntry(createMockAction(), mockState, 'Test action');
      
      const result = historyManager.undo();
      
      expect(result.success).toBe(true);
      expect(result.state).toBeDefined();
      expect(result.description).toContain('Undo');
      expect(historyManager.canUndo()).toBe(false);
      expect(historyManager.canRedo()).toBe(true);
    });

    it('should fail when nothing to undo', () => {
      const result = historyManager.undo();
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Nothing to undo');
      expect(result.state).toBeUndefined();
    });

    it('should handle multiple undos', () => {
      // Add 3 entries
      for (let i = 0; i < 3; i++) {
        historyManager.addEntry(createMockAction(), mockState, `Action ${i}`);
      }
      
      // Undo all
      let result = historyManager.undo();
      expect(result.success).toBe(true);
      
      result = historyManager.undo();
      expect(result.success).toBe(true);
      
      result = historyManager.undo();
      expect(result.success).toBe(false); // Should fail on the third undo
    });
  });

  describe('redo', () => {
    it('should redo the next action', () => {
      historyManager.addEntry(createMockAction(), mockState, 'Test action');
      historyManager.undo();
      
      const result = historyManager.redo();
      
      expect(result.success).toBe(true);
      expect(result.state).toBeDefined();
      expect(result.description).toContain('Redo');
      expect(historyManager.canUndo()).toBe(true);
      expect(historyManager.canRedo()).toBe(false);
    });

    it('should fail when nothing to redo', () => {
      const result = historyManager.redo();
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Nothing to redo');
      expect(result.state).toBeUndefined();
    });

    it('should handle multiple redos', () => {
      // Add 3 entries
      for (let i = 0; i < 3; i++) {
        historyManager.addEntry(createMockAction(), mockState, `Action ${i}`);
      }
      
      // Undo all
      historyManager.undo();
      historyManager.undo();
      
      // Redo
      let result = historyManager.redo();
      expect(result.success).toBe(true);
      
      result = historyManager.redo();
      expect(result.success).toBe(true);
      
      result = historyManager.redo();
      expect(result.success).toBe(false); // Should fail
    });
  });

  describe('state management', () => {
    it('should validate valid state', () => {
      const isValid = historyManager.validateState(mockState);
      expect(isValid).toBe(true);
    });

    it('should reject invalid state - missing layers', () => {
      const invalidState = { ...mockState, layers: undefined } as any;
      const isValid = historyManager.validateState(invalidState);
      expect(isValid).toBe(false);
    });

    it('should reject invalid state - invalid layer', () => {
      const invalidState = {
        ...mockState,
        layers: [{ id: null, name: 'Invalid' }] as any,
      };
      const isValid = historyManager.validateState(invalidState);
      expect(isValid).toBe(false);
    });

    it('should reject invalid state - missing canvas settings', () => {
      const invalidState = { ...mockState, canvasSettings: undefined } as any;
      const isValid = historyManager.validateState(invalidState);
      expect(isValid).toBe(false);
    });

    it('should calculate checksum when enabled', () => {
      const config: Partial<HistoryManagerConfig> = { enableChecksums: true };
      const manager = new HistoryManager(config);
      
      const checksum = manager.calculateChecksum(mockState);
      expect(checksum).toBeTruthy();
      expect(typeof checksum).toBe('string');
    });

    it('should return empty checksum when disabled', () => {
      const config: Partial<HistoryManagerConfig> = { enableChecksums: false };
      const manager = new HistoryManager(config);
      
      const checksum = manager.calculateChecksum(mockState);
      expect(checksum).toBe('');
    });
  });

  describe('compression', () => {
    it('should compress entries when threshold reached', () => {
      const config: Partial<HistoryManagerConfig> = {
        enableCompression: true,
        compressionThreshold: 3,
        compressionRatio: 0.5,
      };
      const manager = new HistoryManager(config);
      
      // Add entries beyond threshold
      for (let i = 0; i < 5; i++) {
        manager.addEntry(createMockAction(), mockState, `Action ${i}`);
      }
      
      const stats = manager.getStats();
      expect(stats.compressedEntries).toBeGreaterThan(0);
    });

    it('should not compress when disabled', () => {
      const config: Partial<HistoryManagerConfig> = {
        enableCompression: false,
        compressionThreshold: 2,
      };
      const manager = new HistoryManager(config);
      
      // Add entries beyond threshold
      for (let i = 0; i < 5; i++) {
        manager.addEntry(createMockAction(), mockState, `Action ${i}`);
      }
      
      const stats = manager.getStats();
      expect(stats.compressedEntries).toBe(0);
    });
  });

  describe('utility methods', () => {
    it('should clear all history', () => {
      historyManager.addEntry(createMockAction(), mockState);
      historyManager.clear();
      
      const stats = historyManager.getStats();
      expect(stats.totalEntries).toBe(0);
      expect(historyManager.canUndo()).toBe(false);
      expect(historyManager.canRedo()).toBe(false);
    });

    it('should get recent entries', () => {
      // Add 5 entries
      for (let i = 0; i < 5; i++) {
        historyManager.addEntry(createMockAction(), mockState, `Action ${i}`);
      }
      
      const recent = historyManager.getRecentEntries(3);
      expect(recent).toHaveLength(3);
      expect(recent[recent.length - 1].description).toContain('Action 4');
    });

    it('should create and restore snapshots', () => {
      historyManager.addEntry(createMockAction(), mockState, 'Test action');
      
      const snapshot = historyManager.getSnapshot();
      expect(snapshot.entries).toHaveLength(1);
      expect(snapshot.currentIndex).toBe(0);
      
      const newManager = new HistoryManager();
      newManager.restoreSnapshot(snapshot);
      
      const newStats = newManager.getStats();
      expect(newStats.totalEntries).toBe(1);
      expect(newManager.canUndo()).toBe(true);
    });

    it('should calculate memory usage', () => {
      historyManager.addEntry(createMockAction(), mockState);
      
      const stats = historyManager.getStats();
      expect(stats.memoryUsage).toBeGreaterThan(0);
    });
  });

  describe('specific action helpers', () => {
    it('should add layer action', () => {
      const layer: LayerElement = mockState.layers[0];
      historyManager.addLayerAction(layer, mockState);
      
      const entries = historyManager.getRecentEntries(1);
      expect(entries[0].action.type).toBe('layer_add');
      expect(entries[0].action.elementId).toBe(layer.id);
      expect(entries[0].description).toContain('Add text layer');
    });

    it('should add remove layer action', () => {
      historyManager.removeLayerAction('layer-1', mockState);
      
      const entries = historyManager.getRecentEntries(1);
      expect(entries[0].action.type).toBe('layer_remove');
      expect(entries[0].action.elementId).toBe('layer-1');
    });

    it('should add update layer action', () => {
      const updates = { name: 'Updated Layer' };
      historyManager.updateLayerAction('layer-1', updates, mockState);
      
      const entries = historyManager.getRecentEntries(1);
      expect(entries[0].action.type).toBe('layer_update');
      expect(entries[0].action.data).toEqual(updates);
    });

    it('should add transform action', () => {
      historyManager.transformAction('layer-1', mockState);
      
      const entries = historyManager.getRecentEntries(1);
      expect(entries[0].action.type).toBe('transform_update');
    });

    it('should add crop action', () => {
      historyManager.cropAction('layer-1', mockState);
      
      const entries = historyManager.getRecentEntries(1);
      expect(entries[0].action.type).toBe('crop_apply');
    });

    it('should add color change action', () => {
      historyManager.colorChangeAction('layer-1', mockState);
      
      const entries = historyManager.getRecentEntries(1);
      expect(entries[0].action.type).toBe('color_change');
    });

    it('should add bulk update action', () => {
      const elementIds = ['layer-1', 'layer-2', 'layer-3'];
      historyManager.bulkUpdateAction(elementIds, mockState);
      
      const entries = historyManager.getRecentEntries(1);
      expect(entries[0].action.type).toBe('bulk_update');
      expect(entries[0].action.elementIds).toEqual(elementIds);
      expect(entries[0].description).toContain('Update 3 elements');
    });
  });

  describe('debouncing', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should debounce rapid transform updates', () => {
      const config: Partial<HistoryManagerConfig> = { debounceMs: 300 };
      const manager = new HistoryManager(config);
      
      // Add multiple transform actions rapidly
      for (let i = 0; i < 5; i++) {
        manager.transformAction('layer-1', mockState);
      }
      
      // Should not have committed entries yet
      let stats = manager.getStats();
      expect(stats.totalEntries).toBe(0);
      
      // Fast forward past debounce time
      jest.advanceTimersByTime(300);
      
      // Should now have one entry
      stats = manager.getStats();
      expect(stats.totalEntries).toBe(1);
    });

    it('should not debounce non-debounced actions', () => {
      const config: Partial<HistoryManagerConfig> = { debounceMs: 300 };
      const manager = new HistoryManager(config);
      
      manager.addLayerAction(mockState.layers[0], mockState);
      
      const stats = manager.getStats();
      expect(stats.totalEntries).toBe(1);
    });
  });

  describe('error handling', () => {
    it('should handle state cloning errors gracefully', () => {
      const circularState = { ...mockState } as any;
      circularState.circular = circularState; // Create circular reference
      
      expect(() => {
        historyManager.addEntry(createMockAction(), circularState);
      }).toThrow('Failed to clone state');
    });

    it('should handle checksum calculation errors', () => {
      const config: Partial<HistoryManagerConfig> = { enableChecksums: true };
      const manager = new HistoryManager(config);
      
      const invalidState = { ...mockState } as any;
      invalidState.circular = invalidState;
      
      const checksum = manager.calculateChecksum(invalidState);
      expect(checksum).toBe('');
    });
  });
});