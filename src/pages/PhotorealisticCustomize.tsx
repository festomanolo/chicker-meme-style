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
    setLayers(newLayers);
    history.updateLayer(layerId, updates, getCanvasState());
  }, [layers, layerManager, history, getCanvasState]);

  // Color operations
  const handleColorChange = useCallback((color: TshirtColor) => {
    setTshirtColor(color);
    history.saveState(getCanvasState(), 'Change color');
  }, [history, getCanvasState]);

  // Tool operations
  const handleToolSelect = useCallback((tool: ToolType) => {
    setSelectedTool(tool);
    if (tool === 'crop') {
      setEditMode('crop');
    } else if (tool === 'move') {
      setEditMode('transform');
    }
  }, []);

  // Get selected element
  const selectedElement = selectedIds.length === 1 
    ? layers.find(l => l.id === selectedIds[0]) || null 
    : null;

  // Load default mockup
  useEffect(() => {
    if (!mockup) {
      const defaultMockup: TshirtMockup = {
        id: 'default-tshirt',
        name: 'Classic T-Shirt',
        category: 'apparel',
        baseColor: '#ffffff',
        assets: {
          '1x': '/mockups/tshirt-1x.jpg',
          '2x': '/mockups/tshirt-2x.jpg',
          '3x': '/mockups/tshirt-3x.jpg',
        },
        printArea: {
          x: 200,
          y: 150,
          width: 400,
          height: 300,
        },
        metadata: {
          dimensions: { width: 800, height: 600 },
          dpi: 300,
        },
      };
      setMockup(defaultMockup);
    }
  }, [mockup]);

  return (
    <NotificationProvider
      config={{
        phoneNumber: '1234567890',
        defaultMessage: 'Hi! I need help with my t-shirt design.',
        excludedPages: ['/settings', '/account'],
      }}
    >
      <div className={cn('h-screen flex flex-col bg-gray-50 dark:bg-gray-900', className)}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold">T-Shirt Designer</h1>
            <ToolsRow
              selectedTool={selectedTool}
              onToolSelect={handleToolSelect}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <HistoryControls
              canUndo={history.canUndo}
              canRedo={history.canRedo}
              onUndo={history.undo}
              onRedo={history.redo}
            />
            
            <button
              onClick={() => onSave?.(getCanvasState())}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Save
            </button>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex">
          {/* Sidebar */}
          <div className="w-80 bg-white dark:bg-gray-800 border-r flex-col">
            <div className="p-4">
              <ColorRangeSelector
                color={tshirtColor}
                onChange={handleColorChange}
                presets={colorManager.getPresets()}
              />
            </div>
            
            <div className="flex-1">
              <LayersPanel
                layers={layers}
                groups={groups}
                selectedIds={selectedIds}
                onLayerSelect={(id) => setSelectedIds([id])}
                onLayerReorder={() => {}}
                onLayerUpdate={handleLayerUpdate}
                onLayerDuplicate={() => {}}
                onLayerDelete={() => {}}
                onLayerVisibilityToggle={() => {}}
                onLayerLockToggle={() => {}}
                onGroupCreate={() => {}}
                onGroupRemove={() => {}}
              />
            </div>
          </div>

          {/* Canvas */}
          <div className="flex-1">
            <CanvasContainer
              isPanelOpen={false}
              showControls={true}
            >
              {mockup && (
                <PhotorealisticMockup
                  mockup={mockup}
                  color={tshirtColor}
                />
              )}
            </CanvasContainer>
          </div>

          {/* Properties */}
          <div className="w-80 bg-white dark:bg-gray-800 border-l">
            <PropertiesPanel
              selectedTool={selectedTool}
              selectedElement={selectedElement}
              onElementUpdate={handleLayerUpdate}
            />
          </div>
        </div>
      </div>
    </NotificationProvider>
  );
};

export default PhotorealisticCustomize;