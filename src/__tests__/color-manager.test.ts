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

