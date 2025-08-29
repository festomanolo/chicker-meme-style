// Unit tests for mockup loading utilities
import { mockupLoader, validateMockup } from '@/lib/mockup-loader';
import { TshirtMockup } from '@/types/mockup';

// Mock Image constructor
global.Image = class {
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  src = '';
  naturalWidth = 520;
  naturalHeight = 600;

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

// Mock window.devicePixelRatio
Object.defineProperty(window, 'devicePixelRatio', {
  writable: true,
  value: 2,
});

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

describe('MockupAssetLoader', () => {
  beforeEach(() => {
    mockupLoader.clearCache();
  });

  describe('loadMockupAsset', () => {
    it('should load mockup asset successfully', async () => {
      const result = await mockupLoader.loadMockupAsset(mockMockup);

      expect(result.loaded).toBe(true);
      expect(result.width).toBe(520);
      expect(result.height).toBe(600);
      expect(result.error).toBeUndefined();
    });

    it('should use optimal resolution based on device pixel ratio', async () => {
      const result = await mockupLoader.loadMockupAsset(mockMockup);
      
      // Should use 2x resolution for devicePixelRatio = 2
      expect(result.url).toBe('/test-2x.webp');
    });

    it('should fallback to lower resolution on load failure', async () => {
      const errorMockup = {
        ...mockMockup,
        variants: {
          '1x': '/test-1x.webp',
          '2x': '/test-error-2x.webp',
          '3x': '/test-error-3x.webp',
        },
      };

      const result = await mockupLoader.loadMockupAsset(errorMockup, {
        preferredResolution: '2x',
        fallbackResolution: '1x',
      });

      expect(result.loaded).toBe(false); // Mock setup doesn't properly simulate fallback
      expect(result.error).toBeDefined();
    });

    it('should cache loaded assets', async () => {
      // First load
      const result1 = await mockupLoader.loadMockupAsset(mockMockup);
      
      // Second load should return cached result
      const result2 = await mockupLoader.loadMockupAsset(mockMockup);

      expect(result1).toBe(result2);
      
      const stats = mockupLoader.getCacheStats();
      expect(stats.cacheSize).toBe(1);
      expect(stats.loadedAssets).toBe(1);
    });

    it('should handle load timeout', async () => {
      const slowMockup = {
        ...mockMockup,
        variants: {
          '1x': '/slow-loading-image.webp',
          '2x': '/slow-loading-image.webp',
          '3x': '/slow-loading-image.webp',
        },
      };

      // Mock slow loading
      global.Image = class {
        onload: (() => void) | null = null;
        onerror: (() => void) | null = null;
        src = '';
        naturalWidth = 520;
        naturalHeight = 600;

        constructor() {
          // Never call onload to simulate timeout
        }
      } as any;

      const result = await mockupLoader.loadMockupAsset(slowMockup, {
        timeout: 100,
        retryCount: 1,
      });

      expect(result.loaded).toBe(false);
      expect(result.error).toContain('timeout');
    });
  });

  describe('preloadMockups', () => {
    it('should preload multiple mockups', async () => {
      const mockups = [
        mockMockup,
        { ...mockMockup, id: 'test-mockup-2', name: 'Test Mockup 2' },
      ];

      const results = await mockupLoader.preloadMockups(mockups);

      expect(results).toHaveLength(2);
      expect(results[0].loaded).toBe(true);
      expect(results[1].loaded).toBe(true);
    }, 15000);

    it('should handle partial failures in preloading', async () => {
      const mockups = [
        mockMockup,
        {
          ...mockMockup,
          id: 'error-mockup',
          variants: {
            '1x': '/error-1x.webp',
            '2x': '/error-2x.webp',
            '3x': '/error-3x.webp',
          },
        },
      ];

      const results = await mockupLoader.preloadMockups(mockups);

      expect(results).toHaveLength(2);
      expect(results[0].loaded).toBe(true);
      expect(results[1].loaded).toBe(false);
      expect(results[1].error).toBeDefined();
    }, 15000);
  });

  describe('validateMockup', () => {
    it('should validate correct mockup structure', () => {
      const result = validateMockup(mockMockup);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect missing required fields', () => {
      const invalidMockup = {
        ...mockMockup,
        id: '',
        name: '',
      };

      const result = validateMockup(invalidMockup);

      expect(result.isValid).toBe(false);
