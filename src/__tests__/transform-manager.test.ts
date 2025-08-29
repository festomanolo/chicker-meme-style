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
