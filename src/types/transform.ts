// Transform and coordinate system type definitions

export interface Point {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface TransformData {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
  skewX?: number;
  skewY?: number;
}

export interface ViewportTransform {
  scale: number;
  translateX: number;
  translateY: number;
  rotation: number;
}

export interface CanvasCoordinates {
  canvas: Point;
  screen: Point;
  world: Point;
}

export interface TransformMatrix {
  a: number; // scaleX
  b: number; // skewY
  c: number; // skewX
  d: number; // scaleY
  e: number; // translateX
  f: number; // translateY
}

export interface BoundingBox {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  width: number;
  height: number;
  centerX: number;
  centerY: number;
}

export interface SnapGuide {
  type: 'center' | 'edge' | 'element' | 'grid' | 'mockup';
  position: number;
  axis: 'x' | 'y';
  temporary: boolean;
  elementId?: string;
  priority: number;
}

export interface SnapResult {
  snapped: boolean;
  position: Point;
  guides: SnapGuide[];
  snapDistance: number;
}

export interface TransformConstraints {
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  aspectRatio?: number;
  lockAspectRatio?: boolean;
  bounds?: Rect;
  snapToGrid?: boolean;
  gridSize?: number;
  snapThreshold?: number;
}

export interface TransformHandle {
  id: string;
  type: 'corner' | 'edge' | 'rotation';
  position: 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'rotate';
  cursor: string;
  bounds: Rect;
  active: boolean;
}

export interface DragState {
  isDragging: boolean;
  startPosition: Point;
  currentPosition: Point;
  offset: Point;
  elementId: string | null;
  handleType?: TransformHandle['type'];
  handlePosition?: TransformHandle['position'];
}

export interface PanZoomState {
  scale: number;
  translateX: number;
  translateY: number;
  minScale: number;
  maxScale: number;
  bounds?: Rect;
}

export interface CoordinateSystemConfig {
  canvasSize: Size;
  viewportSize: Size;
  devicePixelRatio: number;
  origin: Point;
  flipY: boolean;
}