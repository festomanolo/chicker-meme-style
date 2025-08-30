// Unit tests for LayersPanel component - Fixed for duplicate rendering issues
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { LayersPanel } from '@/components/layers/LayersPanel';
import { LayerElement, LayerGroup } from '@/types/layer';
import { 
  createLayerTestUtils, 
  layerAssertions, 
  mockDataGenerators 
} from './utils/layer-test-utils';

const { renderLayersPanel, createMockLayers, createMockGroups, createMockLayersWithGroups } = createLayerTestUtils();

describe('LayersPanel - Fixed Rendering', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render individual layers without duplication', () => {
      const layers = createMockLayers(3);
      const { container } = renderLayersPanel({ layers });

      // Should render exactly 3 layers, no duplicates
      layerAssertions.expectCorrectLayerCount(container, 3);
      layerAssertions.expectUniqueElements(container, '[data-testid^="layer-item-"]');
      
      // Verify each layer appears exactly once
      expect(screen.getByText('Layer 1')).toBeInTheDocument();
      expect(screen.getByText('Layer 2')).toBeInTheDocument();
      expect(screen.getByText('Layer 3')).toBeInTheDocument();
    });

    it('should render groups and individual layers separately', () => {
      const { layers, groups } = createMockLayersWithGroups(2, 1, 2);
      // Expand the group to show its layers
      groups[0].expanded = true;
      const { container } = renderLayersPanel({ layers, groups });

      // Should have 2 individual layers + 2 grouped layers = 4 total
      layerAssertions.expectCorrectLayerCount(container, 4);
      layerAssertions.expectNoGroupDuplicates(container);
      layerAssertions.expectUniqueElements(container, '[data-testid^="layer-item-"]');
    });

    it('should not render duplicate elements in groups and individual layers', () => {
      const layers = createMockLayers(6);
      const groups = createMockGroups(2, 2, 1); // 2 groups with 2 layers each
      
      const { container } = renderLayersPanel({
        layers,
        groups: groups.map(g => ({ ...g, expanded: true }))
      });

      // Should have 4 layers in groups + 2 individual layers = 6 total
      layerAssertions.expectCorrectLayerCount(container, 6);
      layerAssertions.expectNoGroupDuplicates(container);
      layerAssertions.expectUniqueElements(container, '[data-testid^="layer-item-"]');
    });

    it('should show correct layer counts in footer', () => {
      const { layers, groups } = createMockLayersWithGroups(3, 2, 2);
      const { container } = renderLayersPanel({ layers, groups });

      layerAssertions.expectAccurateLayerCounts(container, 7, 3, 4);
    });
  });

  describe('Group Functionality', () => {
    it('should render group headers correctly', () => {
      const { layers, groups } = createMockLayersWithGroups(1, 2, 2);
      renderLayersPanel({ layers, groups });

      expect(screen.getByText('Group 1')).toBeInTheDocument();
      expect(screen.getByText('Group 2')).toBeInTheDocument();
      
      // Should show member counts
      expect(screen.getAllByText('2')).toHaveLength(2); // Both groups have 2 members
    });

    it('should handle group expansion without duplicates', async () => {
      const user = userEvent.setup();
      const { layers, groups } = createMockLayersWithGroups(2, 1, 2);
      const onGroupToggle = jest.fn();
      
      const { container } = renderLayersPanel({
        layers,
        groups,
        onGroupToggle
      });

      // Initially collapsed - should not show group content
      layerAssertions.expectGroupExpansionBehavior(container, 'group-1', 0);

      // Expand first group
      const firstGroupHeader = screen.getByTestId('group-header-group-1');
      await user.click(firstGroupHeader);

      expect(onGroupToggle).toHaveBeenCalledWith('group-1');
    });

    it('should show grouped layers only when group is expanded', () => {
      const { layers, groups } = createMockLayersWithGroups(1, 1, 2);
      groups[0].expanded = true; // Expand first group
      
      const { container } = renderLayersPanel({ layers, groups });

      // Should show group content
      layerAssertions.expectGroupExpansionBehavior(container, 'group-1', 2);
      
      // Verify no duplicates
      layerAssertions.expectNoGroupDuplicates(container);
    });

    it('should handle multiple groups with different expansion states', () => {
      const { layers, groups } = createMockLayersWithGroups(2, 2, 3);
      groups[0].expanded = true;  // First group expanded
      groups[1].expanded = false; // Second group collapsed
      
      const { container } = renderLayersPanel({ layers, groups });

      // First group should show its layers
      layerAssertions.expectGroupExpansionBehavior(container, 'group-1', 3);
      
      // Second group should not show its layers
      layerAssertions.expectGroupExpansionBehavior(container, 'group-2', 0);
      
      // Should have 2 individual + 3 from expanded group = 5 total visible layers
      layerAssertions.expectCorrectLayerCount(container, 5);
      layerAssertions.expectNoGroupDuplicates(container);
    });

    it('should handle group with no layers gracefully', () => {
      const layers = createMockLayers(2);
      const groups = createMockGroups(1, 0); // Group with no children
      groups[0].expanded = true;
      
      const { container } = renderLayersPanel({ layers, groups });

      // Group header should still be visible
      expect(screen.getByText('Group 1')).toBeInTheDocument();
      expect(screen.getByText('0')).toBeInTheDocument(); // Member count should be 0
      
      // Should show 2 individual layers
      layerAssertions.expectCorrectLayerCount(container, 2);
    });

    it('should handle group expansion/collapse toggle correctly', async () => {
      const user = userEvent.setup();
      const { layers, groups } = createMockLayersWithGroups(1, 1, 2);
      const onGroupToggle = jest.fn();
      
      renderLayersPanel({ layers, groups, onGroupToggle });

      const groupHeader = screen.getByTestId('group-header-group-1');
      
      // First click - expand
      await user.click(groupHeader);
      expect(onGroupToggle).toHaveBeenCalledWith('group-1');
      
      // Second click - collapse
      await user.click(groupHeader);
      expect(onGroupToggle).toHaveBeenCalledTimes(2);
      expect(onGroupToggle).toHaveBeenLastCalledWith('group-1');
    });

    it('should show correct chevron icons for expanded/collapsed groups', () => {
      const { layers, groups } = createMockLayersWithGroups(0, 2, 1);
      groups[0].expanded = true;
      groups[1].expanded = false;
      
      renderLayersPanel({ layers, groups });

      const expandedGroup = screen.getByTestId('group-header-group-1');
      const collapsedGroup = screen.getByTestId('group-header-group-2');
      
      // Expanded group should have ChevronDown
      expect(expandedGroup.querySelector('.lucide-chevron-down')).toBeInTheDocument();
      
      // Collapsed group should have ChevronRight
      expect(collapsedGroup.querySelector('.lucide-chevron-right')).toBeInTheDocument();
    });

    it('should handle layer interactions within groups correctly', async () => {
      const user = userEvent.setup();
      const { layers, groups } = createMockLayersWithGroups(0, 1, 2);
      groups[0].expanded = true;
      
      const onLayerSelect = jest.fn();
      const onLayerVisibilityToggle = jest.fn();
      
      renderLayersPanel({ 
        layers, 
        groups, 
        onLayerSelect, 
        onLayerVisibilityToggle 
      });

      // Find a layer within the group
      const groupLayer = screen.getByTestId('layer-item-layer-1');
      
      // Test layer selection within group
      await user.click(groupLayer);
      expect(onLayerSelect).toHaveBeenCalledWith('layer-1', false);
      
      // Test layer visibility toggle within group
      const visibilityButton = groupLayer.querySelector('[aria-label*="Hide layer"], [aria-label*="Show layer"]');
      await user.click(visibilityButton!);
      expect(onLayerVisibilityToggle).toHaveBeenCalledWith('layer-1');
    });

    it('should maintain group structure during search', () => {
      const { layers, groups } = createMockLayersWithGroups(1, 1, 2);
      
      const { container } = renderLayersPanel({ 
        layers, 
        groups, 
        searchQuery: 'Layer' 
      });

      // During search, all matching layers should be shown
      // but still maintain uniqueness
      layerAssertions.expectUniqueSearchResults(container);
      layerAssertions.expectUniqueElements(container, '[data-testid^="layer-item-"]');
    });

    it('should show visual indicators for invisible groups', () => {
      const { layers, groups } = createMockLayersWithGroups(0, 1, 2);
      groups[0].visible = false; // Make group invisible
      
      renderLayersPanel({ layers, groups });

      const groupHeader = screen.getByTestId('group-header-group-1');
      
      // Should have opacity styling for invisible group
      expect(groupHeader).toHaveClass('opacity-50');
      
