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
