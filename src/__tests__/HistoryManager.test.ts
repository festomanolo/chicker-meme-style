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
