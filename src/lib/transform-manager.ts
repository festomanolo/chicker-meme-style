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
  }

  /**
   * Convert canvas coordinates to screen coordinates
   */
  canvasToScreen(canvasPoint: Point): Point {
    const rect = this.getCanvasBounds();
    
    return {
      x: canvasPoint.x * this.panZoomState.scale + this.panZoomState.translateX + rect.x,
      y: canvasPoint.y * this.panZoomState.scale + this.panZoomState.translateY + rect.y,
    };
  }

  /**
   * Convert world coordinates to canvas coordinates
   */
  worldToCanvas(worldPoint: Point): Point {
    // Apply viewport transform
    const transformed = this.applyViewportTransform(worldPoint);
    
    // Apply coordinate system origin and flip
    return {
      x: transformed.x + this.config.origin.x,
      y: this.config.flipY ? this.config.canvasSize.height - transformed.y - this.config.origin.y : transformed.y + this.config.origin.y,
    };
  }

  /**
   * Convert canvas coordinates to world coordinates
   */
  canvasToWorld(canvasPoint: Point): Point {
    // Remove coordinate system origin and flip
    const adjusted = {
      x: canvasPoint.x - this.config.origin.x,
      y: this.config.flipY ? this.config.canvasSize.height - canvasPoint.y - this.config.origin.y : canvasPoint.y - this.config.origin.y,
    };
    
    // Remove viewport transform
    return this.removeViewportTransform(adjusted);
  }

  /**
   * Get all coordinate representations of a point
   */
  getCoordinates(screenPoint: Point): CanvasCoordinates {
    const canvas = this.screenToCanvas(screenPoint);
    const world = this.canvasToWorld(canvas);
    
    return {
      canvas,
      screen: screenPoint,
      world,
    };
  }
