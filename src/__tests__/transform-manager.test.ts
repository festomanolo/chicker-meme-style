// Unit tests for TransformManager
import { 
  TransformManager, 
  createTransformManager, 
  createDefaultConfig,
  multiplyMatrices,
  invertMatrix,
  transformPoint
} from '@/lib/transform-manager';
import { 
  Point, 
  Size, 
  Rect, 
  TransformData, 
  CoordinateSystemConfig,
  TransformMatrix
} from '@/types/transform';

const mockCanvasSize: Size = { width: 800, height: 600 };
const mockViewportSize: Size = { width: 1200, height: 800 };

const mockConfig: CoordinateSystemConfig = {
  canvasSize: mockCanvasSize,
  viewportSize: mockViewportSize,
  devicePixelRatio: 1,
  origin: { x: 0, y: 0 },
  flipY: false,
};

const mockTransform: TransformData = {
  x: 100,
  y: 100,
  width: 200,
  height: 150,
  rotation: 45,
  scaleX: 1.2,
  scaleY: 0.8,
};

describe('TransformManager', () => {
  let manager: TransformManager;

  beforeEach(() => {
    manager = new TransformManager(mockConfig);
  });

  describe('coordinate conversion', () => {
    it('should convert screen to canvas coordinates correctly', () => {
      const screenPoint: Point = { x: 100, y: 100 };
      const canvasPoint = manager.screenToCanvas(screenPoint);

      expect(canvasPoint.x).toBe(100);
      expect(canvasPoint.y).toBe(100);
    });

    it('should convert canvas to screen coordinates correctly', () => {
      const canvasPoint: Point = { x: 100, y: 100 };
      const screenPoint = manager.canvasToScreen(canvasPoint);

      expect(screenPoint.x).toBe(100);
      expect(screenPoint.y).toBe(100);
    });

    it('should handle pan and zoom in coordinate conversion', () => {
      manager.setPanZoom({ scale: 2, translateX: 50, translateY: 30 });

      const screenPoint: Point = { x: 100, y: 100 };
      const canvasPoint = manager.screenToCanvas(screenPoint);

      expect(canvasPoint.x).toBe(25); // (100 - 50) / 2
      expect(canvasPoint.y).toBe(35); // (100 - 30) / 2
    });

    it('should convert world to canvas coordinates', () => {
      const worldPoint: Point = { x: 50, y: 50 };
      const canvasPoint = manager.worldToCanvas(worldPoint);

      expect(canvasPoint.x).toBe(50);
      expect(canvasPoint.y).toBe(50);
    });

    it('should convert canvas to world coordinates', () => {
      const canvasPoint: Point = { x: 50, y: 50 };
      const worldPoint = manager.canvasToWorld(canvasPoint);

      expect(worldPoint.x).toBe(50);
      expect(worldPoint.y).toBe(50);
    });

    it('should handle flipped Y coordinate system', () => {
      const flippedConfig = { ...mockConfig, flipY: true };
      const flippedManager = new TransformManager(flippedConfig);

      const canvasPoint: Point = { x: 50, y: 100 };
      const worldPoint = flippedManager.canvasToWorld(canvasPoint);

      expect(worldPoint.x).toBe(50);
      expect(worldPoint.y).toBe(500); // 600 - 100
    });

    it('should get all coordinate representations', () => {
      const screenPoint: Point = { x: 100, y: 100 };
      const coordinates = manager.getCoordinates(screenPoint);

      expect(coordinates.screen).toEqual(screenPoint);
      expect(coordinates.canvas).toBeDefined();
      expect(coordinates.world).toBeDefined();
    });
  });

  describe('transform operations', () => {
    it('should apply transform to element', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      manager.applyTransform('element-1', mockTransform);

      expect(consoleSpy).toHaveBeenCalledWith(
        'Updating element element-1 with transform:',
        expect.objectContaining(mockTransform)
      );

      consoleSpy.mockRestore();
    });

    it('should generate transform matrix correctly', () => {
      const matrix = manager.getTransformMatrix(mockTransform);

      expect(matrix.a).toBeDefined(); // scaleX component
      expect(matrix.b).toBeDefined(); // skewY component
      expect(matrix.c).toBeDefined(); // skewX component
      expect(matrix.d).toBeDefined(); // scaleY component
      expect(matrix.e).toBeDefined(); // translateX component
      expect(matrix.f).toBeDefined(); // translateY component
    });

    it('should generate CSS transform string', () => {
      const cssTransform = manager.getCSSTransform(mockTransform);

      expect(cssTransform).toContain('translate(100px, 100px)');
      expect(cssTransform).toContain('rotate(45deg)');
      expect(cssTransform).toContain('scale(1.2, 0.8)');
    });

    it('should calculate bounding box correctly', () => {
      const simpleTransform: TransformData = {
        x: 100,
        y: 100,
        width: 200,
        height: 150,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
      };

      const boundingBox = manager.getBoundingBox(simpleTransform);

      expect(boundingBox.minX).toBe(100);
      expect(boundingBox.minY).toBe(100);
      expect(boundingBox.maxX).toBe(300);
      expect(boundingBox.maxY).toBe(250);
      expect(boundingBox.width).toBe(200);
      expect(boundingBox.height).toBe(150);
      expect(boundingBox.centerX).toBe(200);
      expect(boundingBox.centerY).toBe(175);
    });

    it('should calculate bounding box for rotated element', () => {
      const rotatedTransform: TransformData = {
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        rotation: 45,
        scaleX: 1,
        scaleY: 1,
      };

      const boundingBox = manager.getBoundingBox(rotatedTransform);

      // For a 100x100 square rotated 45 degrees, the bounding box should be larger
      expect(boundingBox.width).toBeGreaterThan(100);
      expect(boundingBox.height).toBeGreaterThan(100);
    });
  });

  describe('snapping system', () => {
    const mockElements = [
      {
        id: 'element-1',
        x: 50,
        y: 50,
        width: 100,
        height: 100,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
        visible: true,
        locked: false,
      },
      {
        id: 'element-2',
        x: 200,
        y: 200,
        width: 150,
        height: 100,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
        visible: true,
        locked: false,
      },
    ];

    it('should generate snap guides for canvas and elements', () => {
      const guides = manager.generateSnapGuides(mockElements);

      expect(guides.length).toBeGreaterThan(0);
      
      // Should include canvas center guides
      const centerXGuide = guides.find(g => g.type === 'center' && g.axis === 'x');
      const centerYGuide = guides.find(g => g.type === 'center' && g.axis === 'y');
      
      expect(centerXGuide).toBeDefined();
      expect(centerYGuide).toBeDefined();
      expect(centerXGuide!.position).toBe(400); // 800 / 2
      expect(centerYGuide!.position).toBe(300); // 600 / 2
    });

    it('should generate mockup guides when mockup bounds provided', () => {
      const mockupBounds: Rect = { x: 100, y: 100, width: 300, height: 400 };
      const guides = manager.generateSnapGuides(mockElements, mockupBounds);

      const mockupXGuide = guides.find(g => g.type === 'mockup' && g.axis === 'x');
      const mockupYGuide = guides.find(g => g.type === 'mockup' && g.axis === 'y');

      expect(mockupXGuide).toBeDefined();
      expect(mockupYGuide).toBeDefined();
      expect(mockupXGuide!.position).toBe(250); // 100 + 300/2
      expect(mockupYGuide!.position).toBe(300); // 100 + 400/2
    });

    it('should snap position to nearest guide', () => {
      manager.generateSnapGuides(mockElements);
      
      const position: Point = { x: 402, y: 298 }; // Close to canvas center (400, 300)
      const snapResult = manager.snapToGuides(position, 10);

      expect(snapResult.snapped).toBe(true);
      expect(snapResult.position.x).toBe(400);
      expect(snapResult.position.y).toBe(300);
      expect(snapResult.guides.length).toBeGreaterThan(0);
    });

    it('should not snap when distance exceeds threshold', () => {
      manager.generateSnapGuides(mockElements);
      
      const position: Point = { x: 420, y: 320 }; // Too far from canvas center
      const snapResult = manager.snapToGuides(position, 10);

      expect(snapResult.snapped).toBe(false);
      expect(snapResult.position).toEqual(position);
    });

    it('should get temporary guides for visual feedback', () => {
      manager.generateSnapGuides(mockElements);
      manager.snapToGuides({ x: 402, y: 298 }, 10); // Trigger snapping
      
      const temporaryGuides = manager.getTemporaryGuides();
      
      expect(temporaryGuides.length).toBeGreaterThan(0);
      expect(temporaryGuides.every(g => g.temporary)).toBe(true);
    });
  });

  describe('bounds validation', () => {
    it('should validate element bounds within canvas', () => {
      const canvasBounds: Rect = { x: 0, y: 0, width: 800, height: 600 };
      const outOfBoundsTransform: TransformData = {
        x: -50,
        y: -30,
        width: 100,
        height: 100,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
      };

      const validatedTransform = manager.validateBounds(outOfBoundsTransform, canvasBounds);

      expect(validatedTransform.x).toBeGreaterThanOrEqual(0);
      expect(validatedTransform.y).toBeGreaterThanOrEqual(0);
    });

    it('should adjust position when element exceeds right/bottom bounds', () => {
      const canvasBounds: Rect = { x: 0, y: 0, width: 800, height: 600 };
      const outOfBoundsTransform: TransformData = {
        x: 750,
        y: 550,
        width: 100,
        height: 100,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
      };

      const validatedTransform = manager.validateBounds(outOfBoundsTransform, canvasBounds);

      expect(validatedTransform.x + outOfBoundsTransform.width).toBeLessThanOrEqual(800);
      expect(validatedTransform.y + outOfBoundsTransform.height).toBeLessThanOrEqual(600);
    });
  });

  describe('pan and zoom operations', () => {
    it('should set pan and zoom state', () => {
      manager.setPanZoom({ scale: 2, translateX: 100, translateY: 50 });
      
      const panZoom = manager.getPanZoom();
      
      expect(panZoom.scale).toBe(2);
      expect(panZoom.translateX).toBe(100);
      expect(panZoom.translateY).toBe(50);
    });

