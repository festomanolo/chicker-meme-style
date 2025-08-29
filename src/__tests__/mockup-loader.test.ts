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
