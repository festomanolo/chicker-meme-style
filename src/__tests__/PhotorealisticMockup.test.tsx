// Unit tests for PhotorealisticMockup component
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PhotorealisticMockup } from '@/components/mockup/PhotorealisticMockup';
import { TshirtMockup } from '@/types/mockup';

// Mock the mockup loader
jest.mock('@/lib/mockup-loader', () => ({
  loadMockup: jest.fn(),
}));

import { loadMockup } from '@/lib/mockup-loader';
const mockLoadMockup = loadMockup as jest.MockedFunction<typeof loadMockup>;

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

describe('PhotorealisticMockup', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

