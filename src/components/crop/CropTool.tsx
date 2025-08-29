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

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [selectedPreset, setSelectedPreset] = useState<string>('free');

  // Initialize crop state
  const [cropState, setCropState] = useState<CropState>(() => {
    const defaultCrop: CropData = originalCrop || {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      originalWidth: 100,
      originalHeight: 100,
    };

    return {
      isActive: true,
      isDragging: false,
      dragHandle: null,
      startPosition: { x: 0, y: 0 },
      currentCrop: defaultCrop,
      originalCrop: defaultCrop,
      previewCrop: null,
    };
  });

  // Handle image load
  const handleImageLoad = useCallback(() => {
    if (!imageRef.current) return;

    const img = imageRef.current;
    const { naturalWidth, naturalHeight } = img;
    
    setImageDimensions({ width: naturalWidth, height: naturalHeight });
    setImageLoaded(true);

    // Initialize crop to center of image if no original crop
    if (!originalCrop) {
      const cropSize = Math.min(naturalWidth, naturalHeight) * 0.8;
      const centerX = (naturalWidth - cropSize) / 2;
      const centerY = (naturalHeight - cropSize) / 2;

      const initialCrop: CropData = {
        x: centerX,
        y: centerY,
        width: cropSize,
        height: cropSize,
        originalWidth: naturalWidth,
        originalHeight: naturalHeight,
      };

      setCropState(prev => ({
        ...prev,
        currentCrop: initialCrop,
        originalCrop: initialCrop,
      }));
    }
  }, [originalCrop]);

  // Generate crop handles
  const cropHandles = useMemo((): CropHandle[] => {
    if (!imageLoaded) return [];

    const { currentCrop } = cropState;
    const { x, y, width, height } = currentCrop;
    const halfHandle = handleSize / 2;

    return [
      // Corner handles
      {
        id: 'nw',
        type: 'corner',
        position: 'nw',
        cursor: 'nw-resize',
        bounds: { x: x - halfHandle, y: y - halfHandle, width: handleSize, height: handleSize },
      },
      {
        id: 'ne',
        type: 'corner',
        position: 'ne',
        cursor: 'ne-resize',
        bounds: { x: x + width - halfHandle, y: y - halfHandle, width: handleSize, height: handleSize },
      },
      {
        id: 'se',
        type: 'corner',
        position: 'se',
        cursor: 'se-resize',
        bounds: { x: x + width - halfHandle, y: y + height - halfHandle, width: handleSize, height: handleSize },
      },
      {
        id: 'sw',
        type: 'corner',
        position: 'sw',
        cursor: 'sw-resize',
        bounds: { x: x - halfHandle, y: y + height - halfHandle, width: handleSize, height: handleSize },
      },
      // Edge handles
      {
        id: 'n',
        type: 'edge',
        position: 'n',
        cursor: 'n-resize',
        bounds: { x: x + width/2 - halfHandle, y: y - halfHandle, width: handleSize, height: handleSize },
      },
      {
        id: 'e',
        type: 'edge',
        position: 'e',
        cursor: 'e-resize',
        bounds: { x: x + width - halfHandle, y: y + height/2 - halfHandle, width: handleSize, height: handleSize },
      },
      {
        id: 's',
        type: 'edge',
        position: 's',
        cursor: 's-resize',
        bounds: { x: x + width/2 - halfHandle, y: y + height - halfHandle, width: handleSize, height: handleSize },
      },
      {
        id: 'w',
        type: 'edge',
        position: 'w',
        cursor: 'w-resize',
        bounds: { x: x - halfHandle, y: y + height/2 - halfHandle, width: handleSize, height: handleSize },
      },
    ];
  }, [cropState, imageLoaded, handleSize]);

  // Apply constraints to crop
  const applyConstraints = useCallback((crop: CropData): CropData => {
    let constrainedCrop = { ...crop };

    // Apply size constraints
    if (constraints.minWidth) {
      constrainedCrop.width = Math.max(constraints.minWidth, constrainedCrop.width);
    }
    if (constraints.maxWidth) {
      constrainedCrop.width = Math.min(constraints.maxWidth, constrainedCrop.width);
    }
    if (constraints.minHeight) {
      constrainedCrop.height = Math.max(constraints.minHeight, constrainedCrop.height);
    }
    if (constraints.maxHeight) {
      constrainedCrop.height = Math.min(constraints.maxHeight, constrainedCrop.height);
    }

    // Apply aspect ratio constraint
    if (constraints.aspectRatio && constraints.lockAspectRatio) {
      const currentRatio = constrainedCrop.width / constrainedCrop.height;
      if (Math.abs(currentRatio - constraints.aspectRatio) > 0.01) {
        constrainedCrop.height = constrainedCrop.width / constraints.aspectRatio;
      }
    }

    // Keep within image bounds
    constrainedCrop.x = Math.max(0, Math.min(constrainedCrop.x, imageDimensions.width - constrainedCrop.width));
    constrainedCrop.y = Math.max(0, Math.min(constrainedCrop.y, imageDimensions.height - constrainedCrop.height));
    constrainedCrop.width = Math.min(constrainedCrop.width, imageDimensions.width - constrainedCrop.x);
    constrainedCrop.height = Math.min(constrainedCrop.height, imageDimensions.height - constrainedCrop.y);

    return constrainedCrop;
  }, [constraints, imageDimensions]);

  // Calculate new crop based on handle drag
  const calculateCropFromDrag = useCallback((
    handleId: string,
    deltaX: number,
    deltaY: number,
    originalCrop: CropData
  ): CropData => {
    let newCrop = { ...originalCrop };

    switch (handleId) {
      case 'nw':
        newCrop.x += deltaX;
        newCrop.y += deltaY;
        newCrop.width -= deltaX;
        newCrop.height -= deltaY;
        break;
      case 'ne':
        newCrop.y += deltaY;
        newCrop.width += deltaX;
        newCrop.height -= deltaY;
        break;
      case 'se':
        newCrop.width += deltaX;
        newCrop.height += deltaY;
        break;
      case 'sw':
        newCrop.x += deltaX;
        newCrop.width -= deltaX;
        newCrop.height += deltaY;
        break;
      case 'n':
        newCrop.y += deltaY;
        newCrop.height -= deltaY;
        break;
      case 'e':
        newCrop.width += deltaX;
        break;
      case 's':
        newCrop.height += deltaY;
        break;
      case 'w':
        newCrop.x += deltaX;
        newCrop.width -= deltaX;
        break;
    }

    // Ensure minimum size
    const minSize = 20;
    if (newCrop.width < minSize) {
      if (handleId.includes('w')) {
        newCrop.x = originalCrop.x + originalCrop.width - minSize;
      }
      newCrop.width = minSize;
    }
    if (newCrop.height < minSize) {
      if (handleId.includes('n')) {
        newCrop.y = originalCrop.y + originalCrop.height - minSize;
      }
      newCrop.height = minSize;
    }

    return applyConstraints(newCrop);
  }, [applyConstraints]);

  // Handle mouse down on crop handles
  const handleMouseDown = useCallback((e: React.MouseEvent, handleId: string) => {
    e.preventDefault();
    e.stopPropagation();

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    setCropState(prev => ({
      ...prev,
      isDragging: true,
      dragHandle: handleId,
      startPosition: {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      },
    }));
  }, []);

  // Handle mouse move for dragging
  useEffect(() => {
    if (!cropState.isDragging || !cropState.dragHandle) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const currentX = e.clientX - rect.left;
      const currentY = e.clientY - rect.top;
      const deltaX = currentX - cropState.startPosition.x;
      const deltaY = currentY - cropState.startPosition.y;

      const newCrop = calculateCropFromDrag(
        cropState.dragHandle!,
        deltaX,
        deltaY,
        cropState.originalCrop
      );

      setCropState(prev => ({
        ...prev,
        currentCrop: newCrop,
        previewCrop: newCrop,
      }));

      onCropChange?.(newCrop);
    };

    const handleMouseUp = () => {
