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
