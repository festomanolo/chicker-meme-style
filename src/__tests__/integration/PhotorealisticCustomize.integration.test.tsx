// Integration tests for PhotorealisticCustomize component
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import PhotorealisticCustomize from '@/pages/PhotorealisticCustomize';

// Mock components that require complex setup
jest.mock('@/components/mockup/PhotorealisticMockup', () => ({
  PhotorealisticMockup: ({ mockup, color }: any) => (
    <div data-testid="photorealistic-mockup">
      Mockup: {mockup?.name} - Color: {color?.rgb?.r},{color?.rgb?.g},{color?.rgb?.b}
    </div>
  ),
}));

jest.mock('@/components/notifications/NotificationProvider', () => ({
  NotificationProvider: ({ children }: any) => <div>{children}</div>,
}));

// Mock services
jest.mock('@/lib/layer-manager', () => ({
  LayerManager: jest.fn().mockImplementation(() => ({
    addLayer: jest.fn((layers, layer) => [...layers, layer]),
    updateLayer: jest.fn((layers, id, updates) => 
      layers.map((l: any) => l.id === id ? { ...l, ...updates } : l)
    ),
    removeLayer: jest.fn((layers, id) => layers.filter((l: any) => l.id !== id)),
  })),
}));

jest.mock('@/lib/color-manager', () => ({
  ColorManager: jest.fn().mockImplementation(() => ({
    getPresets: jest.fn(() => [
      { h: 0, s: 100, v: 100, rgb: { r: 255, g: 0, b: 0 } },
      { h: 120, s: 100, v: 100, rgb: { r: 0, g: 255, b: 0 } },
      { h: 240, s: 100, v: 100, rgb: { r: 0, g: 0, b: 255 } },
    ]),
    toHex: jest.fn(() => '#ffffff'),
  })),
}));

jest.mock('@/lib/transform-manager', () => ({
  TransformManager: jest.fn().mockImplementation(() => ({
    applyTransform: jest.fn(() => ({ x: 100, y: 100 })),
  })),
}));

// Mock hooks
jest.mock('@/hooks/useCanvasHistory', () => ({
  useCanvasHistory: jest.fn(() => ({
    canUndo: false,
    canRedo: false,
