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
