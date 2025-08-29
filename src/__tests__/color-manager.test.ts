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
