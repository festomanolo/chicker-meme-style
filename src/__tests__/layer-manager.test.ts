// Unit tests for LayerManager service
import { LayerManager, layerManager } from '@/lib/layer-manager';
import { LayerElement, LayerFilter } from '@/types/layer';

const mockElement: Omit<LayerElement, 'id' | 'createdAt' | 'updatedAt' | 'zIndex'> = {
  name: 'Test Element',
  type: 'text',
  visible: true,
  locked: false,
  opacity: 1,
  x: 100,
  y: 100,
  width: 200,
  height: 150,
  rotation: 0,
  scaleX: 1,
  scaleY: 1,
  content: 'Hello World',
};

describe('LayerManager', () => {
  let manager: LayerManager;

  beforeEach(() => {
    manager = new LayerManager();
  });

  describe('layer operations', () => {
    it('should add a new layer', () => {
      const element = manager.addLayer(mockElement);

      expect(element.id).toBeDefined();
      expect(element.name).toBe('Test Element');
      expect(element.zIndex).toBe(1);
      expect(element.createdAt).toBeDefined();
      expect(element.updatedAt).toBeDefined();
      expect(manager.getLayerCount()).toBe(1);
    });

    it('should auto-generate names when not provided', () => {
      const elementWithoutName = { ...mockElement, name: '' };
      const element = manager.addLayer(elementWithoutName);

      expect(element.name).toBe('Text 1');
    });

    it('should generate unique names for same type', () => {
      const element1 = manager.addLayer({ ...mockElement, name: '' });
      const element2 = manager.addLayer({ ...mockElement, name: '' });

      expect(element1.name).toBe('Text 1');
      expect(element2.name).toBe('Text 2');
    });

    it('should assign incremental z-indices', () => {
      const element1 = manager.addLayer(mockElement);
      const element2 = manager.addLayer(mockElement);
      const element3 = manager.addLayer(mockElement);

      expect(element1.zIndex).toBe(1);
      expect(element2.zIndex).toBe(2);
      expect(element3.zIndex).toBe(3);
    });

    it('should remove a layer', () => {
      const element = manager.addLayer(mockElement);
      const removed = manager.removeLayer(element.id);

      expect(removed).toBe(true);
      expect(manager.getLayerCount()).toBe(0);
      expect(manager.getLayer(element.id)).toBeNull();
    });

    it('should return false when removing non-existent layer', () => {
      const removed = manager.removeLayer('non-existent-id');
      expect(removed).toBe(false);
    });

    it('should update layer properties', () => {
      const element = manager.addLayer(mockElement);
      const updated = manager.updateLayer(element.id, { 
        name: 'Updated Name',
        x: 200,
        visible: false 
      });

      expect(updated).toBe(true);
      
      const updatedElement = manager.getLayer(element.id);
      expect(updatedElement!.name).toBe('Updated Name');
      expect(updatedElement!.x).toBe(200);
      expect(updatedElement!.visible).toBe(false);
      expect(updatedElement!.updatedAt).toBeGreaterThan(element.updatedAt);
    });

    it('should duplicate a layer', () => {
      const element = manager.addLayer(mockElement);
      const duplicate = manager.duplicateLayer(element.id);

      expect(duplicate).not.toBeNull();
      expect(duplicate!.id).not.toBe(element.id);
      expect(duplicate!.name).toBe('Test Element Copy');
      expect(duplicate!.x).toBe(element.x + 20);
      expect(duplicate!.y).toBe(element.y + 20);
      expect(manager.getLayerCount()).toBe(2);
    });

    it('should return null when duplicating non-existent layer', () => {
      const duplicate = manager.duplicateLayer('non-existent-id');
      expect(duplicate).toBeNull();
    });
  });

  describe('layer reordering', () => {
    let elements: LayerElement[];

    beforeEach(() => {
      elements = [
        manager.addLayer({ ...mockElement, name: 'Element 1' }),
        manager.addLayer({ ...mockElement, name: 'Element 2' }),
        manager.addLayer({ ...mockElement, name: 'Element 3' }),
      ];
    });

    it('should reorder layer to new position', () => {
      const reordered = manager.reorderLayer(elements[0].id, 2);

      expect(reordered).toBe(true);
      
      const allLayers = manager.getAllLayers();
      expect(allLayers[0].name).toBe('Element 2');
      expect(allLayers[1].name).toBe('Element 3');
      expect(allLayers[2].name).toBe('Element 1');
    });

    it('should update z-indices after reordering', () => {
      manager.reorderLayer(elements[0].id, 2);
      
      const allLayers = manager.getAllLayers();
      expect(allLayers[0].zIndex).toBe(1);
      expect(allLayers[1].zIndex).toBe(2);
      expect(allLayers[2].zIndex).toBe(3);
    });

    it('should bring layer forward', () => {
      const moved = manager.bringForward(elements[0].id);

      expect(moved).toBe(true);
      
      const allLayers = manager.getAllLayers();
      expect(allLayers[0].name).toBe('Element 2');
      expect(allLayers[1].name).toBe('Element 1');
      expect(allLayers[2].name).toBe('Element 3');
    });

    it('should send layer backward', () => {
      const moved = manager.sendBackward(elements[1].id);

      expect(moved).toBe(true);
      
      const allLayers = manager.getAllLayers();
      expect(allLayers[0].name).toBe('Element 2');
      expect(allLayers[1].name).toBe('Element 1');
      expect(allLayers[2].name).toBe('Element 3');
    });

    it('should bring layer to front', () => {
      const moved = manager.bringToFront(elements[0].id);

      expect(moved).toBe(true);
      
      const allLayers = manager.getAllLayers();
      expect(allLayers[2].name).toBe('Element 1');
    });

    it('should send layer to back', () => {
      const moved = manager.sendToBack(elements[2].id);

      expect(moved).toBe(true);
      
      const allLayers = manager.getAllLayers();
      expect(allLayers[0].name).toBe('Element 3');
    });

    it('should not move layer forward if already at front', () => {
      const moved = manager.bringForward(elements[2].id);
      expect(moved).toBe(false);
    });

    it('should not move layer backward if already at back', () => {
      const moved = manager.sendBackward(elements[0].id);
      expect(moved).toBe(false);
    });
  });

  describe('layer visibility and locking', () => {
    let element: LayerElement;

    beforeEach(() => {
      element = manager.addLayer(mockElement);
    });

    it('should toggle layer visibility', () => {
      expect(element.visible).toBe(true);

      const toggled1 = manager.toggleLayerVisibility(element.id);
      expect(toggled1).toBe(true);
      expect(manager.getLayer(element.id)!.visible).toBe(false);

      const toggled2 = manager.toggleLayerVisibility(element.id);
      expect(toggled2).toBe(true);
      expect(manager.getLayer(element.id)!.visible).toBe(true);
    });

    it('should lock and unlock layer', () => {
      expect(element.locked).toBe(false);

      const locked = manager.lockLayer(element.id, true);
      expect(locked).toBe(true);
      expect(manager.getLayer(element.id)!.locked).toBe(true);

      const unlocked = manager.lockLayer(element.id, false);
      expect(unlocked).toBe(true);
      expect(manager.getLayer(element.id)!.locked).toBe(false);
    });

    it('should return false for non-existent layer operations', () => {
      expect(manager.toggleLayerVisibility('non-existent')).toBe(false);
      expect(manager.lockLayer('non-existent', true)).toBe(false);
    });
  });

  describe('layer search', () => {
    beforeEach(() => {
      manager.addLayer({ ...mockElement, name: 'Text Layer 1', content: 'Hello World' });
      manager.addLayer({ ...mockElement, name: 'Image Layer', type: 'image', content: undefined });
      manager.addLayer({ ...mockElement, name: 'Text Layer 2', content: 'Goodbye World' });
    });

    it('should search layers by name', () => {
      const results = manager.searchLayers('Text Layer');

      expect(results.length).toBe(2);
      expect(results[0].matchType).toBe('name');
      expect(results[0].element.name).toContain('Text Layer');
    });

    it('should search layers by type', () => {
      const results = manager.searchLayers('image');

      expect(results.length).toBe(1);
      expect(results[0].matchType).toBe('type');
      expect(results[0].element.type).toBe('image');
    });

    it('should search layers by content', () => {
      const results = manager.searchLayers('Hello');

      expect(results.length).toBe(1);
      expect(results[0].matchType).toBe('content');
      expect(results[0].element.content).toContain('Hello');
    });

    it('should return empty array for empty query', () => {
      const results = manager.searchLayers('');
      expect(results.length).toBe(0);
    });

    it('should return results sorted by score', () => {
      const results = manager.searchLayers('Layer');

      expect(results.length).toBe(3);
      // Results should be sorted by score (highest first)
      for (let i = 1; i < results.length; i++) {
        expect(results[i].score).toBeLessThanOrEqual(results[i - 1].score);
      }
    });
  });

  describe('layer filtering', () => {
    beforeEach(() => {
      manager.addLayer({ ...mockElement, name: 'Text 1', type: 'text', visible: true });
      manager.addLayer({ ...mockElement, name: 'Image 1', type: 'image', visible: false });
      manager.addLayer({ ...mockElement, name: 'Text 2', type: 'text', locked: true });
    });

    it('should filter by type', () => {
      const filter: LayerFilter = { type: ['text'] };
      const filtered = manager.filterLayers(filter);

      expect(filtered.length).toBe(2);
      expect(filtered.every(el => el.type === 'text')).toBe(true);
    });

    it('should filter by visibility', () => {
      const filter: LayerFilter = { visible: false };
      const filtered = manager.filterLayers(filter);

      expect(filtered.length).toBe(1);
      expect(filtered[0].visible).toBe(false);
    });

    it('should filter by lock status', () => {
      const filter: LayerFilter = { locked: true };
      const filtered = manager.filterLayers(filter);

      expect(filtered.length).toBe(1);
      expect(filtered[0].locked).toBe(true);
    });

    it('should filter by search query', () => {
      const filter: LayerFilter = { searchQuery: 'Text' };
      const filtered = manager.filterLayers(filter);

      expect(filtered.length).toBe(2);
      expect(filtered.every(el => el.name.includes('Text'))).toBe(true);
    });

    it('should combine multiple filters', () => {
      const filter: LayerFilter = { 
        type: ['text'], 
        visible: true 
      };
      const filtered = manager.filterLayers(filter);

      expect(filtered.length).toBe(1);
      expect(filtered[0].type).toBe('text');
      expect(filtered[0].visible).toBe(true);
    });
  });

  describe('layer sorting', () => {
    beforeEach(() => {
      // Add elements with different timestamps
      const now = Date.now();
      manager.addLayer({ ...mockElement, name: 'C Element' });
      manager.addLayer({ ...mockElement, name: 'A Element' });
      manager.addLayer({ ...mockElement, name: 'B Element' });
    });

    it('should sort by name ascending', () => {
      const sorted = manager.getSortedLayers('name', 'asc');

      expect(sorted[0].name).toBe('A Element');
      expect(sorted[1].name).toBe('B Element');
      expect(sorted[2].name).toBe('C Element');
    });

    it('should sort by name descending', () => {
      const sorted = manager.getSortedLayers('name', 'desc');

      expect(sorted[0].name).toBe('C Element');
      expect(sorted[1].name).toBe('B Element');
      expect(sorted[2].name).toBe('A Element');
    });

    it('should sort by z-index', () => {
      const sorted = manager.getSortedLayers('zIndex', 'asc');

      expect(sorted[0].zIndex).toBe(1);
      expect(sorted[1].zIndex).toBe(2);
      expect(sorted[2].zIndex).toBe(3);
    });

    it('should sort by creation time', () => {
      const sorted = manager.getSortedLayers('created', 'asc');

      // Should be in order of creation
      expect(sorted[0].createdAt).toBeLessThanOrEqual(sorted[1].createdAt);
      expect(sorted[1].createdAt).toBeLessThanOrEqual(sorted[2].createdAt);
    });
  });

  describe('layer grouping', () => {
    let elements: LayerElement[];

    beforeEach(() => {
      elements = [
        manager.addLayer({ ...mockElement, name: 'Element 1' }),
        manager.addLayer({ ...mockElement, name: 'Element 2' }),
        manager.addLayer({ ...mockElement, name: 'Element 3' }),
      ];
    });

    it('should create a group from multiple elements', () => {
      const group = manager.createGroup([elements[0].id, elements[1].id], 'Test Group');

      expect(group).not.toBeNull();
      expect(group!.name).toBe('Test Group');
      expect(group!.children).toEqual([elements[0].id, elements[1].id]);
      
      // Elements should reference the group
      expect(manager.getLayer(elements[0].id)!.groupId).toBe(group!.id);
      expect(manager.getLayer(elements[1].id)!.groupId).toBe(group!.id);
    });

    it('should auto-generate group name if not provided', () => {
      const group = manager.createGroup([elements[0].id, elements[1].id]);

      expect(group!.name).toBe('Group 1');
    });

    it('should not create group with less than 2 elements', () => {
      const group = manager.createGroup([elements[0].id]);
      expect(group).toBeNull();
    });

    it('should ungroup elements', () => {
      const group = manager.createGroup([elements[0].id, elements[1].id]);
      const ungrouped = manager.ungroup(group!.id);

      expect(ungrouped).toBe(true);
      
      // Elements should no longer reference the group
      expect(manager.getLayer(elements[0].id)!.groupId).toBeUndefined();
      expect(manager.getLayer(elements[1].id)!.groupId).toBeUndefined();
    });
  });

  describe('configuration and limits', () => {
    it('should respect maximum element limit', () => {
      const limitedManager = new LayerManager({ maxElements: 2 });
      
      limitedManager.addLayer(mockElement);
      limitedManager.addLayer(mockElement);
      
      expect(() => {
        limitedManager.addLayer(mockElement);
      }).toThrow('Maximum number of elements (2) reached');
    });

    it('should disable auto-name generation when configured', () => {
      const noAutoNameManager = new LayerManager({ autoGenerateNames: false });
      const element = noAutoNameManager.addLayer({ ...mockElement, name: '' });

      expect(element.name).toBe('text layer');
    });

    it('should disable grouping when configured', () => {
      const noGroupManager = new LayerManager({ enableGrouping: false });
      const element1 = noGroupManager.addLayer(mockElement);
      const element2 = noGroupManager.addLayer(mockElement);
      
      const group = noGroupManager.createGroup([element1.id, element2.id]);
      expect(group).toBeNull();
    });
  });

  describe('event system', () => {
    it('should emit events for layer operations', () => {
      const layerAddedSpy = jest.fn();
      const stateChangedSpy = jest.fn();

      manager.on('layerAdded', layerAddedSpy);
      manager.on('stateChanged', stateChangedSpy);
