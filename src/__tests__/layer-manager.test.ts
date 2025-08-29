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
