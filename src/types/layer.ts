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
