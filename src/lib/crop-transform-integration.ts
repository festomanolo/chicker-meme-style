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

