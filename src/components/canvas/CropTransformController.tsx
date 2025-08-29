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
  const [previewVisible, setPreviewVisible] = useState(showPreview);

  // Update state when mode changes
  useEffect(() => {
    setState(prev => ({ ...prev, mode }));
  }, [mode]);

  // Calculate current crop data
  const currentCrop = useMemo((): CropData => {
    if (state.previewCrop) return state.previewCrop;
    if (element.cropData) return element.cropData;
    
    // Generate default crop from current element
    return {
      x: 0,
      y: 0,
      width: element.width,
      height: element.height,
      originalWidth: element.width,
      originalHeight: element.height,
    };
  }, [element, state.previewCrop]);

  // Calculate current transform data
  const currentTransform = useMemo((): TransformData => {
    if (state.previewTransform) return state.previewTransform;
    
    return {
      x: element.x,
      y: element.y,
      width: element.width,
      height: element.height,
      rotation: element.rotation,
      scaleX: element.scaleX,
      scaleY: element.scaleY,
    };
  }, [element, state.previewTransform]);

  // Handle mode switching with smooth transition
  const handleModeSwitch = useCallback(async (newMode: 'crop' | 'transform') => {
    if (newMode === mode || isTransitioning) return;

    setIsTransitioning(true);

    // Get transition configuration
    const transition = CropTransformIntegration.createModeTransition(mode, newMode, element);

    // Apply transition styles
    const transitionPromise = new Promise<void>((resolve) => {
      setTimeout(() => {
        onModeChange(newMode);
        resolve();
      }, transition.duration);
    });

    await transitionPromise;
    setIsTransitioning(false);
  }, [mode, element, onModeChange, isTransitioning]);

  // Handle crop changes
  const handleCropChange = useCallback((crop: CropData) => {
    // Calculate preview transform based on crop
    const previewTransform = CropTransformIntegration.calculatePreviewTransform(
      state.originalTransform,
      crop
    );

    setState(prev => ({
      ...prev,
      previewCrop: crop,
      previewTransform: previewTransform,
    }));
  }, [state.originalTransform]);

  // Handle transform changes
  const handleTransformChange = useCallback((transform: TransformData) => {
    setState(prev => ({
      ...prev,
      previewTransform: transform,
    }));
  }, []);

  // Handle crop confirm
  const handleCropConfirm = useCallback((crop: CropData) => {
    const updatedElement = CropTransformIntegration.applyCropToElement(element, crop);
    onElementUpdate(updatedElement);
    
    // Clear preview state
    setState(prev => ({
      ...prev,
      previewCrop: null,
      previewTransform: null,
      originalCrop: crop,
    }));
  }, [element, onElementUpdate]);

  // Handle transform confirm
  const handleTransformConfirm = useCallback((transform: TransformData) => {
    const updatedElement: LayerElement = {
      ...element,
      x: transform.x,
      y: transform.y,
      width: transform.width,
      height: transform.height,
      rotation: transform.rotation,
      scaleX: transform.scaleX,
      scaleY: transform.scaleY,
      updatedAt: Date.now(),
    };
    
    onElementUpdate(updatedElement);
    
    // Clear preview state
    setState(prev => ({
      ...prev,
      previewTransform: null,
      originalTransform: transform,
    }));
  }, [element, onElementUpdate]);

  // Handle reset operations
  const handleReset = useCallback(() => {
    if (mode === 'crop') {
      const resetElement = CropTransformIntegration.resetCrop(element);
      onElementUpdate(resetElement);
    } else {
      // Reset transform to original
      handleTransformConfirm(state.originalTransform);
    }
    
    setState(prev => ({
      ...prev,
      previewCrop: null,
      previewTransform: null,
    }));
  }, [mode, element, state.originalTransform, onElementUpdate, handleTransformConfirm]);

  // Handle cancel
  const handleCancel = useCallback(() => {
    setState(prev => ({
      ...prev,
      previewCrop: null,
      previewTransform: null,
    }));
    onCancel();
  }, [onCancel]);

  // Calculate quality validation for current crop
  const cropQuality = useMemo(() => {
    if (mode !== 'crop') return null;
    
    return CropTransformIntegration.validateCropQuality(currentCrop, {
      width: element.width,
      height: element.height,
    });
  }, [mode, currentCrop, element]);

  // Generate preview styles
  const previewStyles = useMemo(() => {
    if (!previewVisible || mode !== 'crop') return {};
    
    return CropTransformIntegration.generateCropPreviewStyles(currentCrop, {
      width: 300,
      height: 200,
    });
  }, [previewVisible, mode, currentCrop]);

  return (
    <div className={cn("flex flex-col h-full bg-white dark:bg-gray-900", className)}>
      {/* Mode switcher and controls */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          {enableModeSwitch && (
            <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-md">
              <Button
                variant={mode === 'transform' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handleModeSwitch('transform')}
                disabled={isTransitioning}
                className="h-8 px-3"
              >
                <Move className="h-4 w-4 mr-1" />
                Transform
              </Button>
              <Button
                variant={mode === 'crop' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handleModeSwitch('crop')}
                disabled={isTransitioning || element.type !== 'image'}
                className="h-8 px-3"
              >
                <Crop className="h-4 w-4 mr-1" />
                Crop
              </Button>
            </div>
          )}
          
          <Badge variant="secondary" className="text-xs">
            {mode === 'crop' ? 'Crop Mode' : 'Transform Mode'}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          {showPreview && mode === 'crop' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPreviewVisible(!previewVisible)}
              className="h-8 px-2"
            >
              {previewVisible ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            disabled={isTransitioning}
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            Reset
          </Button>
          
          <Button
            variant="outline"
