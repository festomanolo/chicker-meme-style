// Unit tests for crop-transform integration utilities
import { CropTransformIntegration } from '@/lib/crop-transform-integration';
import { CropData } from '@/types/crop';
import { TransformData } from '@/types/transform';
import { LayerElement } from '@/types/layer';

describe('CropTransformIntegration', () => {
  const mockCropData: CropData = {
    x: 50,
    y: 50,
    width: 200,
    height: 200,
    originalWidth: 400,
    originalHeight: 400,
  };

  const mockTransformData: TransformData = {
    x: 100,
    y: 100,
    width: 200,
    height: 200,
    rotation: 0,
    scaleX: 1,
    scaleY: 1,
  };

  const mockImageElement: LayerElement = {
    id: 'test-image',
    name: 'Test Image',
    type: 'image',
    visible: true,
    locked: false,
    opacity: 1,
    zIndex: 1,
    x: 100,
    y: 100,
    width: 200,
    height: 200,
    rotation: 0,
    scaleX: 1,
    scaleY: 1,
    imageUrl: '/test-image.jpg',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  describe('cropToTransform', () => {
    it('should convert crop coordinates to transform coordinates', () => {
      const result = CropTransformIntegration.cropToTransform(mockCropData, mockTransformData);

      expect(result.width).toBe(200);
      expect(result.height).toBe(200);
      expect(result.scaleX).toBe(0.5); // 200/400
      expect(result.scaleY).toBe(0.5); // 200/400
    });

    it('should handle crop with different aspect ratio', () => {
      const cropData: CropData = {
        x: 0,
        y: 0,
        width: 400,
        height: 200,
        originalWidth: 400,
        originalHeight: 400,
      };

      const result = CropTransformIntegration.cropToTransform(cropData, mockTransformData);

      expect(result.width).toBe(400);
      expect(result.height).toBe(200);
      expect(result.scaleX).toBe(1);
      expect(result.scaleY).toBe(0.5);
    });

    it('should preserve rotation and other transform properties', () => {
      const transformWithRotation: TransformData = {
        ...mockTransformData,
        rotation: 45,
      };

      const result = CropTransformIntegration.cropToTransform(mockCropData, transformWithRotation);

      expect(result.rotation).toBe(45);
    });
  });

  describe('transformToCrop', () => {
    it('should convert transform coordinates to crop coordinates', () => {
      const originalDimensions = { width: 400, height: 400 };
      const result = CropTransformIntegration.transformToCrop(mockTransformData, originalDimensions);

      expect(result.originalWidth).toBe(400);
      expect(result.originalHeight).toBe(400);
      expect(result.width).toBe(200);
      expect(result.height).toBe(200);
    });

    it('should handle scaled transforms', () => {
      const scaledTransform: TransformData = {
        ...mockTransformData,
        scaleX: 2,
        scaleY: 2,
      };

      const originalDimensions = { width: 400, height: 400 };
      const result = CropTransformIntegration.transformToCrop(scaledTransform, originalDimensions);

      expect(result.width).toBe(100); // 200 / 2
      expect(result.height).toBe(100); // 200 / 2
    });

    it('should clamp crop to image bounds', () => {
      const largeTransform: TransformData = {
        ...mockTransformData,
        x: -100,
        y: -100,
        width: 600,
        height: 600,
      };
