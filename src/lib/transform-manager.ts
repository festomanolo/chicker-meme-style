// Transform manager service for canvas coordinate system and transformations
import { 
  Point, 
  Size, 
  Rect, 
  TransformData, 
  ViewportTransform, 
  CanvasCoordinates,
  TransformMatrix,
  BoundingBox,
  SnapGuide,
  SnapResult,
  TransformConstraints,
  DragState,
  PanZoomState,
  CoordinateSystemConfig
} from '@/types/transform';

/**
 * TransformManager handles all coordinate transformations and canvas interactions
 */
export class TransformManager {
  private config: CoordinateSystemConfig;
  private panZoomState: PanZoomState;
  private snapGuides: SnapGuide[] = [];
  private activeSnapGuides: SnapGuide[] = [];

  constructor(config: CoordinateSystemConfig) {
    this.config = config;
    this.panZoomState = {
      scale: 1,
      translateX: 0,
      translateY: 0,
      minScale: 0.1,
      maxScale: 5,
    };
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<CoordinateSystemConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Convert screen coordinates to canvas coordinates
   */
  screenToCanvas(screenPoint: Point): Point {
    const rect = this.getCanvasBounds();
    
    return {
      x: (screenPoint.x - rect.x - this.panZoomState.translateX) / this.panZoomState.scale,
      y: (screenPoint.y - rect.y - this.panZoomState.translateY) / this.panZoomState.scale,
    };
