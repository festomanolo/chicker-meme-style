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

  /**
   * Apply transform to an element
   */
  applyTransform(elementId: string, transform: TransformData): void {
    // Validate transform data
    const validatedTransform = this.validateTransform(transform);
    
    // Apply constraints if any
    const constrainedTransform = this.applyConstraints(validatedTransform);
    
    // Update element transform
    this.updateElementTransform(elementId, constrainedTransform);
  }

  /**
   * Get transform matrix for an element
   */
  getTransformMatrix(transform: TransformData): TransformMatrix {
    const { x, y, width, height, rotation, scaleX, scaleY } = transform;
    
    // Create transformation matrix
    const cos = Math.cos(rotation * Math.PI / 180);
    const sin = Math.sin(rotation * Math.PI / 180);
    
    // Center point for rotation
    const centerX = x + width / 2;
    const centerY = y + height / 2;
    
    // Translation to center, rotation, scale, translation back
    const matrix: TransformMatrix = {
      a: cos * scaleX,
      b: sin * scaleY,
      c: -sin * scaleX,
      d: cos * scaleY,
      e: centerX - (centerX * cos * scaleX - centerY * sin * scaleX),
      f: centerY - (centerX * sin * scaleY + centerY * cos * scaleY),
    };
    
    return matrix;
  }

  /**
   * Get CSS transform string from transform data
   */
  getCSSTransform(transform: TransformData): string {
    const { x, y, rotation, scaleX, scaleY } = transform;
    
    const transforms = [
      `translate(${x}px, ${y}px)`,
      `rotate(${rotation}deg)`,
      `scale(${scaleX}, ${scaleY})`,
    ];
    
    return transforms.join(' ');
  }

  /**
   * Calculate bounding box for transformed element
   */
  getBoundingBox(transform: TransformData): BoundingBox {
    const { x, y, width, height, rotation } = transform;
    
    // Get corner points
    const corners = [
      { x: 0, y: 0 },
      { x: width, y: 0 },
      { x: width, y: height },
      { x: 0, y: height },
    ];
    
    // Apply rotation around center
    const centerX = width / 2;
    const centerY = height / 2;
    const rad = rotation * Math.PI / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    
    const transformedCorners = corners.map(corner => {
      const relX = corner.x - centerX;
      const relY = corner.y - centerY;
      
      return {
        x: x + centerX + (relX * cos - relY * sin),
        y: y + centerY + (relX * sin + relY * cos),
      };
    });
    
    // Find min/max bounds
    const xs = transformedCorners.map(p => p.x);
    const ys = transformedCorners.map(p => p.y);
    
    const minX = Math.min(...xs);
    const minY = Math.min(...ys);
    const maxX = Math.max(...xs);
    const maxY = Math.max(...ys);
    
    return {
      minX,
      minY,
      maxX,
      maxY,
      width: maxX - minX,
      height: maxY - minY,
      centerX: (minX + maxX) / 2,
      centerY: (minY + maxY) / 2,
    };
  }

  /**
