// Unit tests for useCanvasHistory hook
import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { useCanvasHistory } from '@/hooks/useCanvasHistory';
import { CanvasState } from '@/types/history';
import { LayerElement } from '@/types/layer';

const createMockCanvasState = (): CanvasState => ({
  layers: [
    {
      id: 'layer-1',
      name: 'Test Layer',
      type: 'text',
      visible: true,
      locked: false,
      opacity: 1,
      zIndex: 1,
      x: 100,
      y: 100,
      width: 200,
      height: 50,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
      content: 'Test content',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
  ],
  selectedIds: ['layer-1'],
  canvasSettings: {
    zoom: 1,
    panX: 0,
    panY: 0,
    width: 800,
    height: 600,
  },
});

const createMockLayer = (): LayerElement => ({
  id: 'new-layer',
  name: 'New Layer',
  type: 'image',
  visible: true,
  locked: false,
  opacity: 1,
  zIndex: 2,
  x: 150,
  y: 150,
  width: 100,
  height: 100,
  rotation: 0,
