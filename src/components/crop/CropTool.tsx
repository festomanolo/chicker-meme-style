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
      setCropState(prev => ({
        ...prev,
        isDragging: false,
        dragHandle: null,
        originalCrop: prev.currentCrop,
        previewCrop: null,
      }));
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [cropState.isDragging, cropState.dragHandle, cropState.startPosition, cropState.originalCrop, calculateCropFromDrag, onCropChange]);

  // Handle preset selection
  const handlePresetSelect = useCallback((preset: CropPreset) => {
    setSelectedPreset(preset.id);

    if (preset.aspectRatio === 0) {
      // Free form - remove aspect ratio constraint
      return;
    }

    const { currentCrop } = cropState;
    const newHeight = currentCrop.width / preset.aspectRatio;
    const newCrop = applyConstraints({
      ...currentCrop,
      height: newHeight,
      aspectRatio: preset.aspectRatio,
    });

    setCropState(prev => ({
      ...prev,
      currentCrop: newCrop,
      originalCrop: newCrop,
    }));

    onCropChange?.(newCrop);
  }, [cropState, applyConstraints, onCropChange]);

  // Handle crop confirm
  const handleConfirm = useCallback(() => {
    onCropConfirm(cropState.currentCrop);
  }, [cropState.currentCrop, onCropConfirm]);

  // Handle crop reset
  const handleReset = useCallback(() => {
    const resetCrop = originalCrop || {
      x: 0,
      y: 0,
      width: imageDimensions.width,
      height: imageDimensions.height,
      originalWidth: imageDimensions.width,
      originalHeight: imageDimensions.height,
    };

    setCropState(prev => ({
      ...prev,
      currentCrop: resetCrop,
      originalCrop: resetCrop,
    }));

    onCropChange?.(resetCrop);
  }, [originalCrop, imageDimensions, onCropChange]);

  // Generate grid lines
  const gridLines = useMemo(() => {
    if (!showGrid || !imageLoaded) return null;

    const { currentCrop } = cropState;
    const lines = [];

    // Rule of thirds lines
    const thirdWidth = currentCrop.width / 3;
    const thirdHeight = currentCrop.height / 3;

    // Vertical lines
    for (let i = 1; i < 3; i++) {
      lines.push(
        <line
          key={`v${i}`}
          x1={currentCrop.x + thirdWidth * i}
          y1={currentCrop.y}
          x2={currentCrop.x + thirdWidth * i}
          y2={currentCrop.y + currentCrop.height}
          stroke="white"
          strokeWidth="1"
          opacity={gridOpacity}
        />
      );
    }

    // Horizontal lines
    for (let i = 1; i < 3; i++) {
      lines.push(
        <line
          key={`h${i}`}
          x1={currentCrop.x}
          y1={currentCrop.y + thirdHeight * i}
          x2={currentCrop.x + currentCrop.width}
          y2={currentCrop.y + thirdHeight * i}
          stroke="white"
          strokeWidth="1"
          opacity={gridOpacity}
        />
      );
    }

    return lines;
  }, [showGrid, imageLoaded, cropState, gridOpacity]);

  if (!imageLoaded) {
    return (
      <div className={cn("flex items-center justify-center h-64 bg-gray-100 dark:bg-gray-800 rounded-lg", className)}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Loading image...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col h-full bg-white dark:bg-gray-900", className)}>
      {/* Toolbar */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold">Crop Image</h3>
          <Badge variant="secondary" className="text-xs">
            {Math.round(cropState.currentCrop.width)} × {Math.round(cropState.currentCrop.height)}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RotateCcw className="h-4 w-4 mr-1" />
            Reset
          </Button>
          <Button variant="outline" size="sm" onClick={onCropCancel}>
            <X className="h-4 w-4 mr-1" />
            Cancel
          </Button>
          <Button size="sm" onClick={handleConfirm}>
            <Check className="h-4 w-4 mr-1" />
            Confirm
          </Button>
        </div>
      </div>

      {/* Presets */}
      {enablePresets && (
        <div className="p-3 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 flex-wrap">
            {DEFAULT_PRESETS.map((preset) => (
              <Button
                key={preset.id}
                variant={selectedPreset === preset.id ? "default" : "outline"}
                size="sm"
                onClick={() => handlePresetSelect(preset)}
                className="h-8 px-3 text-xs"
              >
                {preset.id === 'square' && <Square className="h-3 w-3 mr-1" />}
                {preset.id === 'phone' && <Smartphone className="h-3 w-3 mr-1" />}
                {preset.id === 'landscape' && <Monitor className="h-3 w-3 mr-1" />}
                {preset.id === 'portrait' && <Camera className="h-3 w-3 mr-1" />}
                {preset.id === 'widescreen' && <Film className="h-3 w-3 mr-1" />}
                {preset.name}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Crop area */}
      <div className="flex-1 relative overflow-hidden bg-gray-100 dark:bg-gray-800">
        <div
          ref={containerRef}
          className="relative w-full h-full flex items-center justify-center"
          style={{ cursor: cropState.isDragging ? 'grabbing' : 'default' }}
        >
          {/* Image */}
          <img
            ref={imageRef}
            src={imageUrl}
            alt="Crop preview"
            className="max-w-full max-h-full object-contain"
            onLoad={handleImageLoad}
            draggable={false}
          />

          {/* Crop overlay */}
          {imageLoaded && (
            <div className="absolute inset-0 pointer-events-none">
              <svg
                className="w-full h-full"
                style={{ position: 'absolute', top: 0, left: 0 }}
              >
                {/* Dark overlay outside crop area */}
                <defs>
                  <mask id="crop-mask">
                    <rect width="100%" height="100%" fill="white" />
                    <rect
                      x={cropState.currentCrop.x}
                      y={cropState.currentCrop.y}
                      width={cropState.currentCrop.width}
                      height={cropState.currentCrop.height}
                      fill="black"
                    />
                  </mask>
                </defs>
                <rect
                  width="100%"
                  height="100%"
                  fill="black"
                  opacity={overlayOpacity}
                  mask="url(#crop-mask)"
                />

                {/* Crop rectangle border */}
                <rect
                  x={cropState.currentCrop.x}
                  y={cropState.currentCrop.y}
                  width={cropState.currentCrop.width}
                  height={cropState.currentCrop.height}
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                />

                {/* Grid lines */}
                {gridLines}
              </svg>

              {/* Crop handles */}
              <div className="absolute inset-0 pointer-events-auto">
                {cropHandles.map((handle) => (
                  <div
                    key={handle.id}
                    className={cn(
                      "absolute bg-white border-2 border-blue-500 rounded-sm",
                      "hover:bg-blue-50 transition-colors",
                      cropState.isDragging && cropState.dragHandle === handle.id && "bg-blue-100"
                    )}
                    style={{
                      left: handle.bounds.x,
                      top: handle.bounds.y,
                      width: handle.bounds.width,
                      height: handle.bounds.height,
                      cursor: handle.cursor,
                    }}
                    onMouseDown={(e) => handleMouseDown(e, handle.id)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status bar */}
      <div className="p-2 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500">
        <div className="flex items-center justify-between">
          <span>
            Crop: {Math.round(cropState.currentCrop.width)} × {Math.round(cropState.currentCrop.height)}
          </span>
          <span>
            Position: {Math.round(cropState.currentCrop.x)}, {Math.round(cropState.currentCrop.y)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CropTool;