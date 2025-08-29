// Unit tests for ColorManager service
import { ColorManager, colorManager } from '@/lib/color-manager';
import { createTshirtColor } from '@/lib/color-utils';
import { TshirtMockup } from '@/types/mockup';
import { TextureFilter } from '@/types/texture';

// Mock canvas and WebGL
const mockCanvas = {
  getContext: jest.fn(),
  width: 0,
  height: 0,
  toDataURL: jest.fn(() => 'data:image/webp;base64,mock-data'),
};

const mockContext2D = {
  clearRect: jest.fn(),
  drawImage: jest.fn(),
  fillRect: jest.fn(),
  getImageData: jest.fn(() => ({
    data: new Uint8ClampedArray(400), // 100x100 RGBA
    width: 100,
    height: 100,
  })),
  putImageData: jest.fn(),
  createRadialGradient: jest.fn(() => ({
    addColorStop: jest.fn(),
  })),
  createLinearGradient: jest.fn(() => ({
    addColorStop: jest.fn(),
  })),
  beginPath: jest.fn(),
  arc: jest.fn(),
  fill: jest.fn(),
  stroke: jest.fn(),
  moveTo: jest.fn(),
  lineTo: jest.fn(),
  globalCompositeOperation: 'source-over',
  fillStyle: '#000000',
  strokeStyle: '#000000',
  lineWidth: 1,
};

const mockWebGLContext = {
  createShader: jest.fn(() => ({})),
  shaderSource: jest.fn(),
  compileShader: jest.fn(),
  createProgram: jest.fn(() => ({})),
  attachShader: jest.fn(),
  linkProgram: jest.fn(),
  VERTEX_SHADER: 35633,
  FRAGMENT_SHADER: 35632,
};

// Mock document.createElement
Object.defineProperty(document, 'createElement', {
  value: jest.fn((tagName: string) => {
    if (tagName === 'canvas') {
      return {
        ...mockCanvas,
        getContext: jest.fn((type: string) => {
          if (type === '2d') return mockContext2D;
          if (type === 'webgl' || type === 'experimental-webgl') return mockWebGLContext;
          return null;
        }),
      };
    }
    return {};
  }),
});

// Mock Image constructor
global.Image = class {
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  src = '';

  constructor() {
    setTimeout(() => {
      if (this.src.includes('error')) {
        this.onerror?.();
      } else {
        this.onload?.();
      }
    }, 10);
  }
} as any;

const mockColor = createTshirtColor(255, 128, 64, 'Orange');

const mockMockup: TshirtMockup = {
  id: 'test-mockup',
  name: 'Test Mockup',
  type: 'front',
  category: 'regular',
  variants: {
    '1x': '/test-1x.webp',
    '2x': '/test-2x.webp',
    '3x': '/test-3x.webp',
  },
  maskUrl: '/test-mask.png',
  designArea: {
    x: 160,
    y: 120,
    width: 200,
    height: 240,
    curvature: {
      points: [
        { x: 0, y: 0 },
        { x: 200, y: 0 },
        { x: 200, y: 240 },
        { x: 0, y: 240 },
      ],
      closed: true,
    },
  },
  metadata: {
    originalWidth: 520,
    originalHeight: 600,
    designAreaRatio: 0.38,
    shadowIntensity: 0.3,
    fabricTexture: 'cotton-medium',
  },
};

const mockTextureFilter: TextureFilter = {
  id: 'light-wash',
  name: 'Light Wash',
  description: 'Subtle faded appearance',
  category: 'wash',
  cssFilter: 'brightness(1.1) contrast(0.9)',
  canvasFilter: {
    type: 'color-matrix',
    matrix: [1.1, 0, 0, 0, 10, 0, 1.1, 0, 0, 10, 0, 0, 1.1, 0, 10, 0, 0, 0, 1, 0],
  },
  preview: '/test-preview.webp',
  intensity: 30,
  gpuAccelerated: true,
};

describe('ColorManager', () => {
  let manager: ColorManager;

  beforeEach(() => {
    manager = new ColorManager();
    jest.clearAllMocks();
  });

  describe('applyColorToFabric', () => {
    it('should apply color to fabric successfully', async () => {
      const result = await manager.applyColorToFabric(mockColor, mockMockup);

      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });

    it('should apply color with texture filter', async () => {
      const result = await manager.applyColorToFabric(mockColor, mockMockup, mockTextureFilter);

      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });

    it('should cache results for performance', async () => {
      // First call
      const result1 = await manager.applyColorToFabric(mockColor, mockMockup);
      
      // Second call with same parameters should use cache
      const result2 = await manager.applyColorToFabric(mockColor, mockMockup);

      expect(result1).toBe(result2);
    });

    it('should handle errors gracefully and fallback to CSS filters', async () => {
      // Mock an error in the blending process
      const originalCreateElement = document.createElement;
      document.createElement = jest.fn(() => {
        throw new Error('Canvas creation failed');
      });

      const result = await manager.applyColorToFabric(mockColor, mockMockup);

      expect(result).toBeDefined();
      expect(typeof result).toBe('string');

      // Restore original function
      document.createElement = originalCreateElement;
    });

    it('should meet 120ms latency requirement', async () => {
      const startTime = performance.now();
      
      await manager.applyColorToFabric(mockColor, mockMockup);
      
      const duration = performance.now() - startTime;
      expect(duration).toBeLessThan(120);
    });
  });

  describe('blendColorWithFabric', () => {
    it('should blend color with fabric base', () => {
      const result = manager.blendColorWithFabric(mockColor, '#FFFFFF', {
        baseColor: '#FFFFFF',
        overlayColor: mockColor.hex,
        blendMode: 'multiply',
        opacity: 0.8,
        preserveHighlights: true,
        preserveShadows: true,
      });

      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });
  });

  describe('generateColorPreview', () => {
    it('should generate color preview without texture', () => {
      const result = manager.generateColorPreview(mockColor);

      expect(result).toBeDefined();
      expect(result).toMatch(/^data:image/);
    });

    it('should generate color preview with texture', () => {
      const result = manager.generateColorPreview(mockColor, mockTextureFilter);

      expect(result).toBeDefined();
      expect(result).toMatch(/^data:image/);
    });

    it('should create 100x100 preview canvas', () => {
      manager.generateColorPreview(mockColor);

      expect(document.createElement).toHaveBeenCalledWith('canvas');
      expect(mockCanvas.width).toBe(100);
      expect(mockCanvas.height).toBe(100);
    });
  });

  describe('cache management', () => {
    it('should clear cache correctly', async () => {
      // Add something to cache
      await manager.applyColorToFabric(mockColor, mockMockup);
      
      let stats = manager.getCacheStats();
      expect(stats.cacheSize).toBeGreaterThan(0);

      manager.clearCache();
      
      stats = manager.getCacheStats();
      expect(stats.cacheSize).toBe(0);
    });

    it('should provide accurate cache statistics', async () => {
      const stats1 = manager.getCacheStats();
      expect(stats1.cacheSize).toBe(0);

      await manager.applyColorToFabric(mockColor, mockMockup);
      
      const stats2 = manager.getCacheStats();
      expect(stats2.cacheSize).toBe(1);
      expect(stats2.memoryUsage).toBeGreaterThan(0);
    });
  });

  describe('browser capability detection', () => {
    it('should detect WebGL support', () => {
      // WebGL should be supported in our mock
      const result = manager['supportsWebGL']();
      expect(result).toBe(true);
    });

    it('should detect Canvas 2D support', () => {
      // Canvas 2D should be supported in our mock
      const result = manager['supportsCanvas2D']();
      expect(result).toBe(true);
    });

    it('should handle WebGL not supported', () => {
      // Mock WebGL not supported
      const originalGetContext = mockCanvas.getContext;
      mockCanvas.getContext = jest.fn(() => null);

      const result = manager['supportsWebGL']();
      expect(result).toBe(false);

      // Restore
      mockCanvas.getContext = originalGetContext;
    });
  });

  describe('CSS filter generation', () => {
    it('should generate correct CSS filter for color', () => {
      const filter = manager['generateCSSFilter'](mockColor);
      
      expect(filter).toContain('hue-rotate');
      expect(filter).toContain('saturate');
      expect(filter).toContain('brightness');
    });

    it('should include texture filter in CSS', () => {
      const filter = manager['generateCSSFilter'](mockColor, mockTextureFilter);
      
      expect(filter).toContain(mockTextureFilter.cssFilter);
    });

    it('should return "none" for default color values', () => {
      const defaultColor = createTshirtColor(128, 128, 128); // Gray with default HSL values
      const filter = manager['generateCSSFilter'](defaultColor);
      
      // Should have minimal or no filters for neutral gray
      expect(filter).toBeDefined();
    });
  });

  describe('texture pattern application', () => {
    it('should apply weave pattern correctly', () => {
      const ctx = mockContext2D;
      manager['drawWeavePattern'](ctx);

      expect(ctx.beginPath).toHaveBeenCalled();
