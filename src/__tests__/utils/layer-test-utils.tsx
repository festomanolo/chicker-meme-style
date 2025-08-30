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
        id: `layer-${index}`,
        name: `Layer ${index}`,
        type: 'text' as const,
        visible: true,
        locked: false,
        opacity: 1,
        zIndex: count - i, // Higher zIndex for earlier layers so they appear first when sorted
        x: 0,
        y: 0,
        width: 100,
        height: 50,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
        content: `Content ${index}`,
        createdAt: Date.now() - (count - i) * 1000,
        updatedAt: Date.now() - (count - i) * 1000
      };
    });
  };

  const createMockGroups = (
    groupCount: number, 
    layersPerGroup: number, 
    startLayerIndex: number = 1
  ): LayerGroup[] => {
    return Array.from({ length: groupCount }, (_, i) => {
      const groupIndex = i + 1;
      const layerStartIndex = startLayerIndex + (i * layersPerGroup);
      
      return {
        id: `group-${groupIndex}`,
        name: `Group ${groupIndex}`,
        visible: true,
        locked: false,
        expanded: false,
        children: Array.from({ length: layersPerGroup }, (_, j) => 
          `layer-${layerStartIndex + j}`
        ),
        zIndex: groupIndex,
        createdAt: Date.now() - (groupCount - i) * 1000,
        updatedAt: Date.now() - (groupCount - i) * 1000
      };
    });
  };

  const createMockLayersWithGroups = (
    individualCount: number,
    groupCount: number,
    layersPerGroup: number
  ) => {
    const individualLayers = createMockLayers(individualCount, 1);
    const groupedLayers = createMockLayers(
      groupCount * layersPerGroup, 
      individualCount + 1
    );
    const groups = createMockGroups(
      groupCount, 
      layersPerGroup, 
      individualCount + 1
    );

    return {
      layers: [...individualLayers, ...groupedLayers],
      groups,
      individualLayers,
      groupedLayers
    };
  };

  return {
    renderLayersPanel,
    createMockLayers,
    createMockGroups,
    createMockLayersWithGroups
  };
};

// Specialized assertion helpers for layer components
export const layerAssertions = {
  /**
   * Verify that all elements with a given selector have unique test IDs
   */
  expectUniqueElements: (container: HTMLElement, selector: string) => {
    const elements = container.querySelectorAll(selector);
    const testIds = Array.from(elements)
      .map(el => el.getAttribute('data-testid'))
      .filter(Boolean);
    
    const uniqueTestIds = new Set(testIds);
    
    expect(uniqueTestIds.size).toBe(testIds.length);
    
    if (uniqueTestIds.size !== testIds.length) {
      const duplicates = testIds.filter((id, index) => testIds.indexOf(id) !== index);
      throw new Error(`Duplicate test IDs found: ${duplicates.join(', ')}`);
    }
  },

  /**
   * Verify that no layer appears in both group and individual contexts
   */
  expectNoGroupDuplicates: (container: HTMLElement) => {
    // Get all layer items in groups
    const groupLayerElements = container.querySelectorAll('[data-testid^="group-"] [data-testid^="layer-item-"]');
    const groupLayerIds = new Set<string>();
    
    groupLayerElements.forEach(element => {
      const testId = element.getAttribute('data-testid');
      if (testId) {
        const layerId = testId.replace('layer-item-', '');
        groupLayerIds.add(layerId);
      }
    });

    // Get all individual layer items
    const individualLayerElements = container.querySelectorAll('[data-testid^="individual-"] [data-testid^="layer-item-"], [data-testid^="layer-item-"]:not([data-testid^="group-"] [data-testid^="layer-item-"])');
    const individualLayerIds = new Set<string>();
    
    individualLayerElements.forEach(element => {
      const testId = element.getAttribute('data-testid');
      if (testId) {
        const layerId = testId.replace('layer-item-', '');
        individualLayerIds.add(layerId);
      }
    });

    // Check for intersection (layers appearing in both contexts)
    const intersection = new Set([...groupLayerIds].filter(id => individualLayerIds.has(id)));
    
    expect(intersection.size).toBe(0);
    
    if (intersection.size > 0) {
      throw new Error(`Layers found in both group and individual contexts: ${Array.from(intersection).join(', ')}`);
    }
  },

  /**
   * Verify the correct total number of layer elements are rendered
   */
  expectCorrectLayerCount: (container: HTMLElement, expectedCount: number) => {
    const allLayerElements = container.querySelectorAll('[data-testid^="layer-item-"]');
    expect(allLayerElements.length).toBe(expectedCount);
  },

  /**
   * Verify that grouped layers only appear when their group is expanded
   */
  expectGroupExpansionBehavior: (container: HTMLElement, groupId: string, expectedLayerCount: number) => {
    const groupContent = container.querySelector(`[data-testid="group-content-${groupId}"]`);
    
    if (groupContent) {
      // Group is expanded - should show layers
      const groupLayers = groupContent.querySelectorAll('[data-testid^="layer-item-"]');
      expect(groupLayers.length).toBe(expectedLayerCount);
    } else {
      // Group is collapsed - should not show layer content
      const groupElement = container.querySelector(`[data-testid="layer-group-${groupId}"]`);
      expect(groupElement).toBeTruthy();
      
      const layersInGroup = groupElement?.querySelectorAll('[data-testid^="layer-item-"]');
      expect(layersInGroup?.length || 0).toBe(0);
    }
  },

  /**
   * Verify search results don't contain duplicates
   */
  expectUniqueSearchResults: (container: HTMLElement) => {
    const searchResults = container.querySelectorAll('[data-testid^="search-result-"]');
    const resultIds = Array.from(searchResults).map(el => el.getAttribute('data-testid'));
    const uniqueIds = new Set(resultIds);
