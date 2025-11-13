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
