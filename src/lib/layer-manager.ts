// Layer management service for design elements
import { 
  LayerElement, 
  LayerGroup, 
  LayerOperation, 
  LayerSearchResult, 
  LayerFilter,
  LayerManagerState,
  LayerManagerConfig
} from '@/types/layer';

/**
 * LayerManager handles all layer operations including add, remove, reorder, search, and grouping
 */
export class LayerManager {
  private state: LayerManagerState;
  private config: LayerManagerConfig;
  private operationHistory: LayerOperation[] = [];
  private listeners: Map<string, Function[]> = new Map();

  constructor(config: Partial<LayerManagerConfig> = {}) {
    this.config = {
      maxElements: 100,
      autoGenerateNames: true,
      enableGrouping: true,
      enableSearch: true,
      thumbnailSize: 48,
      ...config,
    };

    this.state = {
      elements: [],
      groups: [],
      selectedIds: [],
      searchQuery: '',
      filter: {},
      sortBy: 'zIndex',
      sortOrder: 'asc',
    };
  }

  /**
   * Add a new layer element
   */
  addLayer(element: Omit<LayerElement, 'id' | 'createdAt' | 'updatedAt' | 'zIndex'>): LayerElement {
    if (this.state.elements.length >= this.config.maxElements) {
      throw new Error(`Maximum number of elements (${this.config.maxElements}) reached`);
    }

    const now = Date.now();
    const newElement: LayerElement = {
      ...element,
      id: this.generateId(),
      name: element.name || this.generateName(element.type),
      zIndex: this.getNextZIndex(),
      createdAt: now,
      updatedAt: now,
    };

    this.state.elements.push(newElement);
    this.recordOperation({
      type: 'add',
      elementId: newElement.id,
      data: newElement,
      timestamp: now,
    });

    this.emit('layerAdded', newElement);
    this.emit('stateChanged', this.state);

    return newElement;
  }

  /**
   * Remove a layer element
   */
  removeLayer(elementId: string): boolean {
    const elementIndex = this.state.elements.findIndex(el => el.id === elementId);
    if (elementIndex === -1) return false;

    const element = this.state.elements[elementIndex];
    this.state.elements.splice(elementIndex, 1);

    // Remove from selection if selected
    this.state.selectedIds = this.state.selectedIds.filter(id => id !== elementId);

    // Remove from any groups
    this.state.groups.forEach(group => {
      group.children = group.children.filter(id => id !== elementId);
    });

    this.recordOperation({
      type: 'remove',
      elementId,
      data: element,
      timestamp: Date.now(),
    });

    this.emit('layerRemoved', element);
    this.emit('stateChanged', this.state);

    return true;
  }

  /**
   * Reorder layer by moving to new index
   */
  reorderLayer(elementId: string, newIndex: number): boolean {
    const currentIndex = this.state.elements.findIndex(el => el.id === elementId);
    if (currentIndex === -1) return false;

    const element = this.state.elements[currentIndex];
    
    // Remove from current position
    this.state.elements.splice(currentIndex, 1);
    
    // Insert at new position
    const clampedIndex = Math.max(0, Math.min(newIndex, this.state.elements.length));
    this.state.elements.splice(clampedIndex, 0, element);

    // Update z-indices to match new order
    this.updateZIndices();

    this.recordOperation({
      type: 'reorder',
      elementId,
      data: { from: currentIndex, to: clampedIndex },
      timestamp: Date.now(),
    });

    this.emit('layerReordered', { element, from: currentIndex, to: clampedIndex });
    this.emit('stateChanged', this.state);

    return true;
  }

  /**
   * Update layer properties
   */
  updateLayer(elementId: string, updates: Partial<LayerElement>): boolean {
    const element = this.state.elements.find(el => el.id === elementId);
    if (!element) return false;

    const oldElement = { ...element };
    Object.assign(element, updates, { updatedAt: Date.now() });

    this.recordOperation({
      type: 'update',
      elementId,
      data: { old: oldElement, new: element },
      timestamp: Date.now(),
    });

    this.emit('layerUpdated', { element, updates });
    this.emit('stateChanged', this.state);

    return true;
  }

  /**
   * Duplicate a layer element
   */
  duplicateLayer(elementId: string): LayerElement | null {
    const element = this.state.elements.find(el => el.id === elementId);
    if (!element) return null;

    const duplicatedElement = this.addLayer({
      ...element,
      name: `${element.name} Copy`,
      x: element.x + 20,
      y: element.y + 20,
    });

    this.recordOperation({
      type: 'duplicate',
      elementId: duplicatedElement.id,
      data: { originalId: elementId },
      timestamp: Date.now(),
    });

    return duplicatedElement;
  }

  /**
   * Toggle layer visibility
   */
  toggleLayerVisibility(elementId: string): boolean {
    const element = this.state.elements.find(el => el.id === elementId);
    if (!element) return false;

    element.visible = !element.visible;
    element.updatedAt = Date.now();

    this.emit('layerVisibilityChanged', { element, visible: element.visible });
    this.emit('stateChanged', this.state);

    return true;
  }

  /**
   * Lock/unlock layer
   */
  lockLayer(elementId: string, locked: boolean): boolean {
    const element = this.state.elements.find(el => el.id === elementId);
    if (!element) return false;

    element.locked = locked;
    element.updatedAt = Date.now();

    this.emit('layerLockChanged', { element, locked });
    this.emit('stateChanged', this.state);

    return true;
  }

  /**
   * Bring layer forward
   */
  bringForward(elementId: string): boolean {
    const currentIndex = this.state.elements.findIndex(el => el.id === elementId);
    if (currentIndex === -1 || currentIndex === this.state.elements.length - 1) return false;

    return this.reorderLayer(elementId, currentIndex + 1);
  }

  /**
   * Send layer backward
   */
  sendBackward(elementId: string): boolean {
    const currentIndex = this.state.elements.findIndex(el => el.id === elementId);
    if (currentIndex === -1 || currentIndex === 0) return false;

    return this.reorderLayer(elementId, currentIndex - 1);
  }

  /**
   * Bring layer to front
   */
  bringToFront(elementId: string): boolean {
    return this.reorderLayer(elementId, this.state.elements.length - 1);
  }

  /**
   * Send layer to back
   */
  sendToBack(elementId: string): boolean {
    return this.reorderLayer(elementId, 0);
  }

  /**
   * Search layers by name, type, or content
   */
  searchLayers(query: string): LayerSearchResult[] {
    if (!query.trim()) return [];

    const results: LayerSearchResult[] = [];
    const searchTerm = query.toLowerCase();

    this.state.elements.forEach(element => {
      let score = 0;
      let matchType: LayerSearchResult['matchType'] | null = null;

      // Search by name
      if (element.name.toLowerCase().includes(searchTerm)) {
        score += element.name.toLowerCase() === searchTerm ? 100 : 50;
        matchType = 'name';
      }

      // Search by type
      if (element.type.toLowerCase().includes(searchTerm)) {
        score += 30;
        if (!matchType) matchType = 'type';
      }

      // Search by content
      if (element.content && element.content.toLowerCase().includes(searchTerm)) {
        score += element.content.toLowerCase() === searchTerm ? 80 : 40;
        if (!matchType) matchType = 'content';
      }

      if (score > 0 && matchType) {
        results.push({ element, matchType, score });
      }
    });

    // Sort by score (highest first)
    return results.sort((a, b) => b.score - a.score);
  }

  /**
   * Filter layers based on criteria
   */
  filterLayers(filter: LayerFilter): LayerElement[] {
    return this.state.elements.filter(element => {
      // Type filter
      if (filter.type && !filter.type.includes(element.type)) {
        return false;
      }

      // Visibility filter
      if (filter.visible !== undefined && element.visible !== filter.visible) {
        return false;
