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
