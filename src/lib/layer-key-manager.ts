// Centralized key management system for layer rendering
// Ensures unique keys across all rendering contexts to prevent duplicate rendering
import React from 'react';

export type LayerRenderContext = 'individual' | 'group' | 'search';

class LayerKeyManager {
  private static instance: LayerKeyManager;
  private keyMap: Map<string, string> = new Map();
  private usedKeys: Set<string> = new Set();

  static getInstance(): LayerKeyManager {
    if (!LayerKeyManager.instance) {
      LayerKeyManager.instance = new LayerKeyManager();
    }
    return LayerKeyManager.instance;
  }

  /**
   * Generate a unique key for a layer in a specific rendering context
   */
  generateKey(context: LayerRenderContext, layerId: string, groupId?: string): string {
    let baseKey: string;
    
    switch (context) {
      case 'individual':
        baseKey = `individual-${layerId}`;
        break;
      case 'group':
        baseKey = groupId ? `group-${groupId}-layer-${layerId}` : `group-layer-${layerId}`;
        break;
      case 'search':
        baseKey = `search-result-${layerId}`;
        break;
      default:
        baseKey = `unknown-${layerId}`;
    }

    // Ensure uniqueness by adding suffix if needed
    let uniqueKey = baseKey;
    let counter = 1;
    while (this.usedKeys.has(uniqueKey)) {
      uniqueKey = `${baseKey}-${counter}`;
      counter++;
    }

    this.keyMap.set(`${context}-${layerId}-${groupId || ''}`, uniqueKey);
    this.usedKeys.add(uniqueKey);
    
    return uniqueKey;
  }

  /**
   * Get existing key for a layer context or generate new one
   */
  getKey(context: LayerRenderContext, layerId: string, groupId?: string): string {
    const lookupKey = `${context}-${layerId}-${groupId || ''}`;
    const existingKey = this.keyMap.get(lookupKey);
    
    if (existingKey) {
      return existingKey;
    }
    
    return this.generateKey(context, layerId, groupId);
  }

  /**
   * Clear all keys (useful for testing or component unmounting)
   */
  clearKeys(): void {
    this.keyMap.clear();
    this.usedKeys.clear();
  }

  /**
   * Clear keys for a specific context
   */
  clearContextKeys(context: LayerRenderContext): void {
    const keysToRemove: string[] = [];
    
    this.keyMap.forEach((value, key) => {
      if (key.startsWith(`${context}-`)) {
        keysToRemove.push(key);
        this.usedKeys.delete(value);
      }
    });
    
    keysToRemove.forEach(key => this.keyMap.delete(key));
  }

  /**
   * Validate that no duplicate keys exist
   */
  validateUniqueKeys(): boolean {
    const allKeys = Array.from(this.keyMap.values());
    const uniqueKeys = new Set(allKeys);
    
    if (allKeys.length !== uniqueKeys.size) {
      console.error('Duplicate keys detected in LayerKeyManager');
      return false;
    }
    
    return true;
  }

  /**
   * Get debug information about current keys
   */
  getDebugInfo(): { totalKeys: number; keysByContext: Record<string, number> } {
    const keysByContext: Record<string, number> = {};
    
    this.keyMap.forEach((_, key) => {
      const context = key.split('-')[0];
      keysByContext[context] = (keysByContext[context] || 0) + 1;
    });
    
    return {
      totalKeys: this.keyMap.size,
      keysByContext
    };
  }
}

// React hook for consistent key generation
export const useLayerKeys = () => {
  const keyManager = LayerKeyManager.getInstance();
  
  return {
    getIndividualKey: (layerId: string) => 
      keyManager.getKey('individual', layerId),
    getGroupKey: (layerId: string, groupId: string) => 
      keyManager.getKey('group', layerId, groupId),
    getSearchKey: (layerId: string) => 
      keyManager.getKey('search', layerId),
    clearKeys: () => keyManager.clearKeys(),
    clearContextKeys: (context: LayerRenderContext) => 
      keyManager.clearContextKeys(context),
    validateKeys: () => keyManager.validateUniqueKeys(),
    getDebugInfo: () => keyManager.getDebugInfo()
  };
};

// Development-time duplicate detection
export const useDuplicateDetection = (elementId: string, renderType: string) => {
  if (process.env.NODE_ENV === 'development') {
    const keyManager = LayerKeyManager.getInstance();
    
    // Check if this element is being rendered multiple times
    React.useEffect(() => {
      const debugInfo = keyManager.getDebugInfo();
      const isValid = keyManager.validateUniqueKeys();
      
      if (!isValid) {
        console.warn(`Potential duplicate rendering detected for element ${elementId} as ${renderType}`);
        console.log('Key manager debug info:', debugInfo);
      }
    }, [elementId, renderType, keyManager]);
  }
};

export default LayerKeyManager;