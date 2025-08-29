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
