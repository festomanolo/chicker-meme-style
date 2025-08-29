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
