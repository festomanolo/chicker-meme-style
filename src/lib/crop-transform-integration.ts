// Integration utilities for crop and transform systems
import { CropData } from '@/types/crop';
import { TransformData } from '@/types/transform';
import { LayerElement } from '@/types/layer';

export interface CropTransformState {
  mode: 'transform' | 'crop';
  element: LayerElement;
  originalTransform: TransformData;
  originalCrop?: CropData;
  previewTransform?: TransformData;
  previewCrop?: CropData;
}

export interface CropBounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

export class CropTransformIntegration {
  /**
   * Convert crop coordinates to transform coordinates
   */
  static cropToTransform(crop: CropData, elementTransform: TransformData): TransformData {
    // Calculate the new transform based on crop
    const scaleX = crop.width / crop.originalWidth;
    const scaleY = crop.height / crop.originalHeight;
    
    // Adjust position to account for crop offset
    const offsetX = -crop.x * scaleX;
    const offsetY = -crop.y * scaleY;
    
    return {
      ...elementTransform,
      x: elementTransform.x + offsetX,
      y: elementTransform.y + offsetY,
      width: crop.width,
      height: crop.height,
      scaleX: elementTransform.scaleX * scaleX,
      scaleY: elementTransform.scaleY * scaleY,
    };
  }

  /**
   * Convert transform coordinates to crop coordinates
   */
  static transformToCrop(transform: TransformData, originalDimensions: { width: number; height: number }): CropData {
    const { width: originalWidth, height: originalHeight } = originalDimensions;
    
    // Calculate crop based on transform
    const cropWidth = transform.width / transform.scaleX;
    const cropHeight = transform.height / transform.scaleY;
    
    // Calculate crop position
    const cropX = Math.max(0, -transform.x / transform.scaleX);
    const cropY = Math.max(0, -transform.y / transform.scaleY);
    
    return {
      x: cropX,
      y: cropY,
      width: Math.min(cropWidth, originalWidth - cropX),
      height: Math.min(cropHeight, originalHeight - cropY),
      originalWidth,
      originalHeight,
    };
  }

  /**
   * Calculate crop bounds based on current transform
   */
  static calculateCropBounds(transform: TransformData, imageDimensions: { width: number; height: number }): CropBounds {
    const { width: imageWidth, height: imageHeight } = imageDimensions;
    
    // Calculate the visible area based on current transform
    const visibleLeft = Math.max(0, -transform.x / transform.scaleX);
    const visibleTop = Math.max(0, -transform.y / transform.scaleY);
    const visibleRight = Math.min(imageWidth, visibleLeft + transform.width / transform.scaleX);
    const visibleBottom = Math.min(imageHeight, visibleTop + transform.height / transform.scaleY);
    
    return {
      minX: visibleLeft,
      minY: visibleTop,
      maxX: visibleRight,
      maxY: visibleBottom,
    };
  }

  /**
   * Validate crop against transform constraints
   */
  static validateCropWithTransform(crop: CropData, transform: TransformData): CropData {
    let validatedCrop = { ...crop };
    
    // Ensure crop doesn't exceed original dimensions
    validatedCrop.width = Math.min(validatedCrop.width, crop.originalWidth - validatedCrop.x);
    validatedCrop.height = Math.min(validatedCrop.height, crop.originalHeight - validatedCrop.y);
    
    // Ensure minimum crop size
    const minSize = 10;
    validatedCrop.width = Math.max(minSize, validatedCrop.width);
    validatedCrop.height = Math.max(minSize, validatedCrop.height);
    
    // Adjust position if crop extends beyond bounds
    validatedCrop.x = Math.max(0, Math.min(validatedCrop.x, crop.originalWidth - validatedCrop.width));
    validatedCrop.y = Math.max(0, Math.min(validatedCrop.y, crop.originalHeight - validatedCrop.height));
    
    return validatedCrop;
  }

  /**
   * Apply crop to element while preserving transform properties
   */
  static applyCropToElement(element: LayerElement, crop: CropData): LayerElement {
    if (element.type !== 'image') {
      return element;
    }

    // Calculate new transform based on crop
    const newTransform = this.cropToTransform(crop, {
      x: element.x,
      y: element.y,
      width: element.width,
      height: element.height,
      rotation: element.rotation,
      scaleX: element.scaleX,
      scaleY: element.scaleY,
    });

    return {
      ...element,
      x: newTransform.x,
      y: newTransform.y,
      width: newTransform.width,
      height: newTransform.height,
      scaleX: newTransform.scaleX,
      scaleY: newTransform.scaleY,
      cropData: crop,
      updatedAt: Date.now(),
    };
  }

  /**
   * Reset crop while maintaining current transform
   */
  static resetCrop(element: LayerElement): LayerElement {
    if (element.type !== 'image' || !element.cropData) {
      return element;
    }

    const { cropData } = element;
    const resetCrop: CropData = {
      x: 0,
      y: 0,
      width: cropData.originalWidth,
      height: cropData.originalHeight,
      originalWidth: cropData.originalWidth,
      originalHeight: cropData.originalHeight,
    };

    return this.applyCropToElement(element, resetCrop);
  }

  /**
   * Calculate preview transform during crop operation
   */
  static calculatePreviewTransform(
    originalTransform: TransformData,
    previewCrop: CropData
  ): TransformData {
    return this.cropToTransform(previewCrop, originalTransform);
  }

  /**
   * Smooth transition between crop and transform modes
   */
  static createModeTransition(
    fromMode: 'crop' | 'transform',
    toMode: 'crop' | 'transform',
    element: LayerElement
  ): {
    duration: number;
    easing: string;
    properties: string[];
  } {
    const baseTransition = {
      duration: 300,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      properties: ['transform', 'opacity'],
    };

    if (fromMode === 'crop' && toMode === 'transform') {
      return {
        ...baseTransition,
        properties: ['transform', 'opacity', 'border-radius'],
      };
    }

    if (fromMode === 'transform' && toMode === 'crop') {
      return {
        ...baseTransition,
        properties: ['transform', 'opacity', 'mask'],
      };
    }

    return baseTransition;
  }

  /**
   * Generate crop preview styles for CSS
   */
  static generateCropPreviewStyles(crop: CropData, containerDimensions: { width: number; height: number }) {
    const { width: containerWidth, height: containerHeight } = containerDimensions;
    
    // Calculate scale to fit crop in container
    const scaleX = containerWidth / crop.originalWidth;
    const scaleY = containerHeight / crop.originalHeight;
    const scale = Math.min(scaleX, scaleY);
    
    // Calculate crop position and size in container
    const cropLeft = crop.x * scale;
    const cropTop = crop.y * scale;
    const cropWidth = crop.width * scale;
    const cropHeight = crop.height * scale;
    
    return {
      clipPath: `inset(${cropTop}px ${containerWidth - cropLeft - cropWidth}px ${containerHeight - cropTop - cropHeight}px ${cropLeft}px)`,
      transform: `scale(${scale})`,
      transformOrigin: 'top left',
    };
  }

  /**
   * Calculate optimal crop for current viewport
   */
  static calculateOptimalCrop(
    element: LayerElement,
    viewportDimensions: { width: number; height: number }
  ): CropData {
    if (element.type !== 'image') {
      throw new Error('Can only calculate crop for image elements');
    }

    const { width: viewportWidth, height: viewportHeight } = viewportDimensions;
    const aspectRatio = viewportWidth / viewportHeight;
    
    // Use element dimensions as original if no crop data exists
    const originalWidth = element.cropData?.originalWidth || element.width;
    const originalHeight = element.cropData?.originalHeight || element.height;
    const originalAspectRatio = originalWidth / originalHeight;
    
    let cropWidth: number;
    let cropHeight: number;
    let cropX: number;
    let cropY: number;
    
    if (aspectRatio > originalAspectRatio) {
      // Viewport is wider - crop height
      cropWidth = originalWidth;
      cropHeight = originalWidth / aspectRatio;
      cropX = 0;
      cropY = (originalHeight - cropHeight) / 2;
    } else {
      // Viewport is taller - crop width
      cropHeight = originalHeight;
      cropWidth = originalHeight * aspectRatio;
      cropY = 0;
      cropX = (originalWidth - cropWidth) / 2;
    }
    
    return {
      x: Math.max(0, cropX),
      y: Math.max(0, cropY),
      width: Math.min(cropWidth, originalWidth),
      height: Math.min(cropHeight, originalHeight),
      originalWidth,
      originalHeight,
    };
  }

  /**
   * Check if crop operation would result in significant quality loss
   */
  static validateCropQuality(crop: CropData, targetDimensions: { width: number; height: number }): {
    isValid: boolean;
    qualityScore: number;
    warnings: string[];
  } {
    const { width: targetWidth, height: targetHeight } = targetDimensions;
    const warnings: string[] = [];
    
    // Calculate scale factors
    const scaleX = targetWidth / crop.width;
    const scaleY = targetHeight / crop.height;
    const maxScale = Math.max(scaleX, scaleY);
    
    // Calculate quality score (0-1, where 1 is best quality)
    let qualityScore = 1;
    
    if (maxScale > 2) {
      qualityScore *= 0.5;
      warnings.push('Significant upscaling detected - image may appear pixelated');
    } else if (maxScale > 1.5) {
      qualityScore *= 0.7;
      warnings.push('Moderate upscaling detected - some quality loss expected');
    }
    
    // Check crop size relative to original
    const cropRatio = (crop.width * crop.height) / (crop.originalWidth * crop.originalHeight);
    if (cropRatio < 0.1) {
      qualityScore *= 0.6;
      warnings.push('Very small crop area - consider using a larger selection');
    } else if (cropRatio < 0.25) {
      qualityScore *= 0.8;
      warnings.push('Small crop area - quality may be reduced');
    }
    
    const isValid = qualityScore > 0.3 && warnings.length < 3;
    
    return {
      isValid,
      qualityScore,
      warnings,
    };
  }
}