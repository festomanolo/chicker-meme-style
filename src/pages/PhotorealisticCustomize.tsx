// Main photorealistic customize page integrating all components
import React, { useState, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';

// Core components
import { PhotorealisticMockup } from '@/components/mockup/PhotorealisticMockup';
import { ColorRangeSelector } from '@/components/color/ColorRangeSelector';
import { CropTransformController } from '@/components/canvas/CropTransformController';
import { LayersPanel } from '@/components/layers/LayersPanel';
import { CanvasContainer } from '@/components/canvas/CanvasContainer';
import { MobileEditingPanel } from '@/components/mobile/MobileEditingPanel';
import { ToolsRow } from '@/components/tools/ToolsRow';
import { PropertiesPanel } from '@/components/panels/PropertiesPanel';
import { HistoryControls } from '@/components/canvas/HistoryControls';
import { NotificationProvider } from '@/components/notifications/NotificationProvider';

// Hooks
import { useCanvasHistory } from '@/hooks/useCanvasHistory';
import { useMobileEditingPanel } from '@/components/mobile/MobileEditingPanel';
import { useSnapGuides } from '@/hooks/useSnapGuides';

// Services
import { LayerManager } from '@/lib/layer-manager';
import { ColorManager } from '@/lib/color-manager';
import { TransformManager } from '@/lib/transform-manager';

// Types
import { LayerElement, LayerGroup } from '@/types/layer';
import { TshirtColor } from '@/types/color';
import { ToolType } from '@/types/tools';
import { TransformData } from '@/types/transform';
import { TshirtMockup } from '@/types/mockup';

interface PhotorealisticCustomizeProps {
  initialMockup?: TshirtMockup;
  initialColor?: TshirtColor;
  onSave?: (design: any) => void;
  onExport?: (format: 'png' | 'jpg' | 'svg') => void;
  className?: string;
}

export const PhotorealisticCustomize: React.FC<PhotorealisticCustomizeProps> = ({
  initialMockup,
  initialColor,
  onSave,
  onExport,
  className,
}) => {
  // Core state
  const [mockup, setMockup] = useState<TshirtMockup | null>(initialMockup || null);
  const [tshirtColor, setTshirtColor] = useState<TshirtColor>(
    initialColor || { h: 0, s: 0, v: 100, rgb: { r: 255, g: 255, b: 255 } }
  );
  const [layers, setLayers] = useState<LayerElement[]>([]);
  const [groups, setGroups] = useState<LayerGroup[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedTool, setSelectedTool] = useState<ToolType>('move');
  const [editMode, setEditMode] = useState<'transform' | 'crop'>('transform');

  // Services
  const layerManager = new LayerManager();
  const colorManager = new ColorManager();
  const transformManager = new TransformManager();

  // Hooks
  const history = useCanvasHistory({
    maxEntries: 50,
    enableKeyboardShortcuts: true,
  });

  const mobilePanel = useMobileEditingPanel();

  const snapGuides = useSnapGuides({
    snapThreshold: 10,
    showGuides: true,
  });

  // Canvas state for history
  const getCanvasState = useCallback(() => ({
    layers,
    selectedIds,
    canvasSettings: {
      zoom: 1,
      panX: 0,
      panY: 0,
      width: 800,
      height: 600,
    },
  }), [layers, selectedIds]);

  // Layer operations
  const handleLayerAdd = useCallback((layer: LayerElement) => {
    const newLayers = layerManager.addLayer(layers, layer);
    setLayers(newLayers);
    setSelectedIds([layer.id]);
    history.addLayer(layer, getCanvasState());
  }, [layers, layerManager, history, getCanvasState]);

  const handleLayerUpdate = useCallback((layerId: string, updates: Partial<LayerElement>) => {
    const newLayers = layerManager.updateLayer(layers, layerId, updates);
