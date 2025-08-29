// Controller component for seamless crop and transform mode switching
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { LayerElement } from '@/types/layer';
import { CropData } from '@/types/crop';
import { TransformData } from '@/types/transform';
import { CropTransformIntegration, CropTransformState } from '@/lib/crop-transform-integration';
import { CropTool } from '@/components/crop/CropTool';
import { TransformControls } from '@/components/canvas/TransformControls';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Crop, 
  Move, 
  RotateCcw, 
  Check, 
  X,
  Eye,
  EyeOff
} from 'lucide-react';

interface CropTransformControllerProps {
  element: LayerElement;
  mode: 'crop' | 'transform';
  onModeChange: (mode: 'crop' | 'transform') => void;
  onElementUpdate: (element: LayerElement) => void;
  onCancel: () => void;
  className?: string;
  showPreview?: boolean;
  enableModeSwitch?: boolean;
}

export const CropTransformController: React.FC<CropTransformControllerProps> = ({
  element,
  mode,
  onModeChange,
  onElementUpdate,
  onCancel,
  className,
  showPreview = true,
  enableModeSwitch = true,
}) => {
  const [state, setState] = useState<CropTransformState>(() => ({
    mode,
    element,
    originalTransform: {
      x: element.x,
      y: element.y,
      width: element.width,
      height: element.height,
      rotation: element.rotation,
      scaleX: element.scaleX,
      scaleY: element.scaleY,
    },
    originalCrop: element.cropData,
  }));

  const [isTransitioning, setIsTransitioning] = useState(false);
