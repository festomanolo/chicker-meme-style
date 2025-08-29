// Unit tests for LayerKeyManager
import LayerKeyManager, { useLayerKeys, LayerRenderContext } from '@/lib/layer-key-manager';
import { renderHook } from '@testing-library/react';

describe('LayerKeyManager', () => {
  let keyManager: LayerKeyManager;

  beforeEach(() => {
    keyManager = LayerKeyManager.getInstance();
    keyManager.clearKeys();
  });

  afterEach(() => {
    keyManager.clearKeys();
  });

  describe('Singleton Pattern', () => {
    it('should return the same instance', () => {
      const instance1 = LayerKeyManager.getInstance();
      const instance2 = LayerKeyManager.getInstance();
      
      expect(instance1).toBe(instance2);
    });
  });

  describe('Key Generation', () => {
    it('should generate unique keys for different contexts', () => {
      const individualKey = keyManager.generateKey('individual', 'layer-1');
      const groupKey = keyManager.generateKey('group', 'layer-1', 'group-1');
      const searchKey = keyManager.generateKey('search', 'layer-1');

      expect(individualKey).toBe('individual-layer-1');
      expect(groupKey).toBe('group-group-1-layer-layer-1');
      expect(searchKey).toBe('search-result-layer-1');
      
      // All keys should be different
      expect(new Set([individualKey, groupKey, searchKey]).size).toBe(3);
    });

    it('should handle duplicate key generation by adding suffix', () => {
      const key1 = keyManager.generateKey('individual', 'layer-1');
      const key2 = keyManager.generateKey('individual', 'layer-1');

      expect(key1).toBe('individual-layer-1');
      expect(key2).toBe('individual-layer-1-1');
    });

    it('should return existing key when requested again', () => {
