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
