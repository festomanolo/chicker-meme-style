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
      
