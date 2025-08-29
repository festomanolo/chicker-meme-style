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
   * Snap position to guides
   */
  snapToGuides(position: Point, threshold: number = 10): SnapResult {
    const activeGuides: SnapGuide[] = [];
    let snappedPosition = { ...position };
    let minDistance = threshold;
    let snapped = false;

    // Check all snap guides
    for (const guide of this.snapGuides) {
      let distance: number;
      
      if (guide.axis === 'x') {
        distance = Math.abs(position.x - guide.position);
        if (distance < minDistance) {
          snappedPosition.x = guide.position;
          minDistance = distance;
          snapped = true;
          activeGuides.push(guide);
        }
      } else {
        distance = Math.abs(position.y - guide.position);
        if (distance < minDistance) {
          snappedPosition.y = guide.position;
          minDistance = distance;
          snapped = true;
          activeGuides.push(guide);
        }
      }
    }

    // Update active snap guides for visual feedback
    this.activeSnapGuides = activeGuides;

    return {
      snapped,
      position: snappedPosition,
      guides: activeGuides,
      snapDistance: minDistance,
    };
  }

  /**
   * Generate snap guides for canvas
   */
  generateSnapGuides(elements: any[], mockupBounds?: Rect): SnapGuide[] {
    const guides: SnapGuide[] = [];

    // Canvas center guides
    guides.push(
      {
        type: 'center',
        position: this.config.canvasSize.width / 2,
        axis: 'x',
        temporary: false,
        priority: 1,
      },
      {
        type: 'center',
        position: this.config.canvasSize.height / 2,
        axis: 'y',
        temporary: false,
        priority: 1,
      }
    );

    // Mockup centerline guides
    if (mockupBounds) {
      guides.push(
        {
          type: 'mockup',
          position: mockupBounds.x + mockupBounds.width / 2,
          axis: 'x',
          temporary: false,
          priority: 2,
        },
        {
          type: 'mockup',
          position: mockupBounds.y + mockupBounds.height / 2,
          axis: 'y',
          temporary: false,
          priority: 2,
        }
      );
    }

    // Element guides
    elements.forEach(element => {
      if (element.visible && !element.locked) {
        const bounds = this.getBoundingBox(element);
        
        // Element edges
        guides.push(
          { type: 'element', position: bounds.minX, axis: 'x', temporary: false, elementId: element.id, priority: 3 },
          { type: 'element', position: bounds.maxX, axis: 'x', temporary: false, elementId: element.id, priority: 3 },
          { type: 'element', position: bounds.minY, axis: 'y', temporary: false, elementId: element.id, priority: 3 },
          { type: 'element', position: bounds.maxY, axis: 'y', temporary: false, elementId: element.id, priority: 3 },
          { type: 'element', position: bounds.centerX, axis: 'x', temporary: false, elementId: element.id, priority: 2 },
          { type: 'element', position: bounds.centerY, axis: 'y', temporary: false, elementId: element.id, priority: 2 }
        );
      }
    });

    // Sort by priority
    guides.sort((a, b) => a.priority - b.priority);

    this.snapGuides = guides;
    return guides;
  }

  /**
   * Get temporary guide lines for visual feedback
   */
  getTemporaryGuides(): SnapGuide[] {
    return this.activeSnapGuides.map(guide => ({
      ...guide,
      temporary: true,
    }));
  }

  /**
   * Validate bounds for element
   */
  validateBounds(transform: TransformData, canvasBounds: Rect): TransformData {
    const bounds = this.getBoundingBox(transform);
    
    let adjustedTransform = { ...transform };
    
    // Check if element is within canvas bounds
    if (bounds.minX < canvasBounds.x) {
      adjustedTransform.x += canvasBounds.x - bounds.minX;
    }
    if (bounds.minY < canvasBounds.y) {
      adjustedTransform.y += canvasBounds.y - bounds.minY;
    }
    if (bounds.maxX > canvasBounds.x + canvasBounds.width) {
      adjustedTransform.x -= bounds.maxX - (canvasBounds.x + canvasBounds.width);
    }
    if (bounds.maxY > canvasBounds.y + canvasBounds.height) {
      adjustedTransform.y -= bounds.maxY - (canvasBounds.y + canvasBounds.height);
    }
    
    return adjustedTransform;
  }

  /**
   * Pan and zoom operations
   */
  setPanZoom(panZoom: Partial<PanZoomState>): void {
    this.panZoomState = {
      ...this.panZoomState,
      ...panZoom,
      scale: Math.max(
        this.panZoomState.minScale,
        Math.min(this.panZoomState.maxScale, panZoom.scale || this.panZoomState.scale)
      ),
    };
  }

  getPanZoom(): PanZoomState {
    return { ...this.panZoomState };
  }

  /**
   * Zoom to fit content
   */
  zoomToFit(contentBounds: Rect, padding: number = 20): void {
    const viewportSize = this.config.viewportSize;
    
    const scaleX = (viewportSize.width - padding * 2) / contentBounds.width;
    const scaleY = (viewportSize.height - padding * 2) / contentBounds.height;
    const scale = Math.min(scaleX, scaleY);
    
    const centerX = contentBounds.x + contentBounds.width / 2;
    const centerY = contentBounds.y + contentBounds.height / 2;
    
    const translateX = viewportSize.width / 2 - centerX * scale;
    const translateY = viewportSize.height / 2 - centerY * scale;
    
    this.setPanZoom({
      scale,
      translateX,
      translateY,
    });
  }

  /**
   * Reset pan and zoom to default
   */
  resetPanZoom(): void {
    this.setPanZoom({
      scale: 1,
      translateX: 0,
      translateY: 0,
    });
  }

  /**
   * Private helper methods
   */
  private getCanvasBounds(): Rect {
    // This would typically get the actual canvas element bounds
    // For now, return a default based on viewport
    return {
      x: 0,
      y: 0,
      width: this.config.viewportSize.width,
      height: this.config.viewportSize.height,
    };
  }

  private applyViewportTransform(point: Point): Point {
    return {
      x: point.x * this.panZoomState.scale + this.panZoomState.translateX,
      y: point.y * this.panZoomState.scale + this.panZoomState.translateY,
    };
  }

  private removeViewportTransform(point: Point): Point {
    return {
      x: (point.x - this.panZoomState.translateX) / this.panZoomState.scale,
