// Enhanced test utilities for layer components
// Provides proper mock data generation and assertion helpers to prevent duplicate rendering issues

import React from 'react';
import { render, RenderResult } from '@testing-library/react';
import { LayerElement, LayerGroup } from '@/types/layer';
import { LayersPanel } from '@/components/layers/LayersPanel';
import LayerKeyManager from '@/lib/layer-key-manager';

export interface LayersPanelProps {
  layers: LayerElement[];
  groups: LayerGroup[];
  selectedIds: string[];
  onLayerSelect: (elementId: string, multiSelect?: boolean) => void;
  onLayerReorder: (elementId: string, newIndex: number) => void;
  onLayerUpdate: (elementId: string, updates: Partial<LayerElement>) => void;
  onLayerDelete: (elementId: string) => void;
  onLayerDuplicate: (elementId: string) => void;
  onLayerVisibilityToggle: (elementId: string) => void;
  onLayerLockToggle: (elementId: string) => void;
  onGroupToggle?: (groupId: string) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  showThumbnails?: boolean;
  enableInlineEdit?: boolean;
  enableDragReorder?: boolean;
}

export const createLayerTestUtils = () => {
  const renderLayersPanel = (props: Partial<LayersPanelProps> = {}): RenderResult => {
    const defaultProps: LayersPanelProps = {
      layers: [],
      groups: [],
      selectedIds: [],
      onLayerSelect: jest.fn(),
      onLayerReorder: jest.fn(),
      onLayerUpdate: jest.fn(),
      onLayerDelete: jest.fn(),
      onLayerDuplicate: jest.fn(),
      onLayerVisibilityToggle: jest.fn(),
      onLayerLockToggle: jest.fn(),
      onGroupToggle: jest.fn(),
      searchQuery: '',
      onSearchChange: jest.fn(),
      showThumbnails: true,
      enableInlineEdit: true,
      enableDragReorder: true,
      ...props
    };

    return render(<LayersPanel {...defaultProps} />);
  };

  const createMockLayers = (count: number, startIndex: number = 1): LayerElement[] => {
    return Array.from({ length: count }, (_, i) => {
      const index = startIndex + i;
      return {
