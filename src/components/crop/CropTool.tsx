// Non-destructive crop tool component
import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { CropData, CropState, CropHandle, CropConstraints, CropPreset, CropToolConfig } from '@/types/crop';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Check, 
  X, 
  RotateCcw, 
  Square, 
  Smartphone, 
  Monitor,
  Camera,
  Film
} from 'lucide-react';

interface CropToolProps {
  imageUrl: string;
  originalCrop?: CropData;
  constraints?: CropConstraints;
  config?: CropToolConfig;
  onCropChange?: (crop: CropData) => void;
  onCropConfirm: (crop: CropData) => void;
  onCropCancel: () => void;
  className?: string;
}

const DEFAULT_PRESETS: CropPreset[] = [
  { id: 'free', name: 'Free', aspectRatio: 0 },
  { id: 'square', name: '1:1', aspectRatio: 1 },
  { id: 'portrait', name: '3:4', aspectRatio: 3/4 },
  { id: 'landscape', name: '4:3', aspectRatio: 4/3 },
  { id: 'widescreen', name: '16:9', aspectRatio: 16/9 },
  { id: 'phone', name: '9:16', aspectRatio: 9/16 },
];

export const CropTool: React.FC<CropToolProps> = ({
  imageUrl,
  originalCrop,
  constraints = {},
  config = {},
  onCropChange,
  onCropConfirm,
  onCropCancel,
  className,
}) => {
  const {
    showGrid = true,
    gridOpacity = 0.3,
    overlayOpacity = 0.5,
    handleSize = 12,
    snapThreshold = 5,
    enablePresets = true,
    enableFreeform = true,
  } = config;
