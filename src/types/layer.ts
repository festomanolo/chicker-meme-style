// Layer management type definitions

export interface LayerElement {
  id: string;
  name: string;
  type: 'text' | 'image' | 'shape' | 'sticker' | 'template';
  visible: boolean;
  locked: boolean;
  opacity: number;
  zIndex: number;
  thumbnail?: string;
  
  // Transform properties
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
  
  // Type-specific properties
  content?: string;
  imageUrl?: string;
  color?: string;
  font?: string;
  fontSize?: number;
  
  // Metadata
  createdAt: number;
  updatedAt: number;
  parentId?: string;
  groupId?: string;
}

export interface LayerGroup {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  expanded: boolean;
  children: string[];
  zIndex: number;
  createdAt: number;
  updatedAt: number;
}

export interface LayerOperation {
  type: 'add' | 'remove' | 'reorder' | 'update' | 'duplicate' | 'group' | 'ungroup';
  elementId: string;
  data?: any;
  timestamp: number;
}

export interface LayerSearchResult {
  element: LayerElement;
  matchType: 'name' | 'type' | 'content';
  score: number;
}

export interface LayerFilter {
  type?: LayerElement['type'][];
  visible?: boolean;
  locked?: boolean;
  searchQuery?: string;
  groupId?: string;
}

export interface LayerManagerState {
  elements: LayerElement[];
  groups: LayerGroup[];
  selectedIds: string[];
  searchQuery: string;
  filter: LayerFilter;
  sortBy: 'name' | 'type' | 'created' | 'updated' | 'zIndex';
  sortOrder: 'asc' | 'desc';
}

export interface LayerManagerConfig {
  maxElements: number;
  autoGenerateNames: boolean;
  enableGrouping: boolean;
  enableSearch: boolean;
  thumbnailSize: number;
}