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
      const key1 = keyManager.getKey('individual', 'layer-1');
      const key2 = keyManager.getKey('individual', 'layer-1');

      expect(key1).toBe(key2);
      expect(key1).toBe('individual-layer-1');
    });
  });

  describe('Key Management', () => {
    it('should clear all keys', () => {
      keyManager.generateKey('individual', 'layer-1');
      keyManager.generateKey('group', 'layer-2', 'group-1');
      
      expect(keyManager.getDebugInfo().totalKeys).toBe(2);
      
      keyManager.clearKeys();
      
      expect(keyManager.getDebugInfo().totalKeys).toBe(0);
    });

    it('should clear keys for specific context', () => {
      keyManager.generateKey('individual', 'layer-1');
      keyManager.generateKey('group', 'layer-2', 'group-1');
      keyManager.generateKey('search', 'layer-3');
      
      expect(keyManager.getDebugInfo().totalKeys).toBe(3);
      
      keyManager.clearContextKeys('individual');
      
      const debugInfo = keyManager.getDebugInfo();
      expect(debugInfo.totalKeys).toBe(2);
      expect(debugInfo.keysByContext.individual).toBeUndefined();
    });

    it('should validate unique keys', () => {
      keyManager.generateKey('individual', 'layer-1');
      keyManager.generateKey('group', 'layer-2', 'group-1');
      
      expect(keyManager.validateUniqueKeys()).toBe(true);
    });

    it('should provide debug information', () => {
      keyManager.generateKey('individual', 'layer-1');
      keyManager.generateKey('individual', 'layer-2');
      keyManager.generateKey('group', 'layer-3', 'group-1');
      
      const debugInfo = keyManager.getDebugInfo();
      
      expect(debugInfo.totalKeys).toBe(3);
      expect(debugInfo.keysByContext.individual).toBe(2);
      expect(debugInfo.keysByContext.group).toBe(1);
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing groupId for group context', () => {
      const key = keyManager.generateKey('group', 'layer-1');
      expect(key).toBe('group-layer-layer-1');
    });

    it('should handle unknown context', () => {
      const key = keyManager.generateKey('unknown' as LayerRenderContext, 'layer-1');
      expect(key).toBe('unknown-layer-1');
    });

    it('should handle empty layer IDs', () => {
      const key = keyManager.generateKey('individual', '');
      expect(key).toBe('individual-');
    });
  });
});

describe('useLayerKeys Hook', () => {
  beforeEach(() => {
    const keyManager = LayerKeyManager.getInstance();
    keyManager.clearKeys();
  });

  it('should provide key generation functions', () => {
    const { result } = renderHook(() => useLayerKeys());
    
    expect(typeof result.current.getIndividualKey).toBe('function');
    expect(typeof result.current.getGroupKey).toBe('function');
    expect(typeof result.current.getSearchKey).toBe('function');
    expect(typeof result.current.clearKeys).toBe('function');
    expect(typeof result.current.validateKeys).toBe('function');
  });

  it('should generate consistent keys', () => {
    const { result } = renderHook(() => useLayerKeys());
    
    const key1 = result.current.getIndividualKey('layer-1');
    const key2 = result.current.getIndividualKey('layer-1');
    
    expect(key1).toBe(key2);
    expect(key1).toBe('individual-layer-1');
  });
