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

      const originalDimensions = { width: 400, height: 400 };
      const result = CropTransformIntegration.transformToCrop(largeTransform, originalDimensions);

      expect(result.x).toBeGreaterThanOrEqual(0);
      expect(result.y).toBeGreaterThanOrEqual(0);
      expect(result.width).toBeLessThanOrEqual(400);
      expect(result.height).toBeLessThanOrEqual(400);
    });
  });

  describe('calculateCropBounds', () => {
    it('should calculate correct crop bounds', () => {
      const imageDimensions = { width: 400, height: 400 };
      const result = CropTransformIntegration.calculateCropBounds(mockTransformData, imageDimensions);

      expect(result.minX).toBeGreaterThanOrEqual(0);
      expect(result.minY).toBeGreaterThanOrEqual(0);
      expect(result.maxX).toBeLessThanOrEqual(400);
      expect(result.maxY).toBeLessThanOrEqual(400);
    });

    it('should handle negative transform positions', () => {
      const negativeTransform: TransformData = {
        ...mockTransformData,
        x: -50,
        y: -50,
      };

      const imageDimensions = { width: 400, height: 400 };
      const result = CropTransformIntegration.calculateCropBounds(negativeTransform, imageDimensions);

      expect(result.minX).toBeGreaterThan(0);
      expect(result.minY).toBeGreaterThan(0);
    });
  });

  describe('validateCropWithTransform', () => {
    it('should validate crop within bounds', () => {
      const result = CropTransformIntegration.validateCropWithTransform(mockCropData, mockTransformData);

      expect(result.x).toBeGreaterThanOrEqual(0);
      expect(result.y).toBeGreaterThanOrEqual(0);
      expect(result.width).toBeGreaterThan(0);
      expect(result.height).toBeGreaterThan(0);
    });

    it('should enforce minimum crop size', () => {
      const smallCrop: CropData = {
        ...mockCropData,
        width: 5,
        height: 5,
      };

      const result = CropTransformIntegration.validateCropWithTransform(smallCrop, mockTransformData);

      expect(result.width).toBeGreaterThanOrEqual(10);
      expect(result.height).toBeGreaterThanOrEqual(10);
    });

    it('should adjust position if crop extends beyond bounds', () => {
      const outOfBoundsCrop: CropData = {
        ...mockCropData,
        x: 350,
        y: 350,
        width: 100,
        height: 100,
      };

      const result = CropTransformIntegration.validateCropWithTransform(outOfBoundsCrop, mockTransformData);

      expect(result.x + result.width).toBeLessThanOrEqual(mockCropData.originalWidth);
      expect(result.y + result.height).toBeLessThanOrEqual(mockCropData.originalHeight);
    });
  });

  describe('applyCropToElement', () => {
    it('should apply crop to image element', () => {
      const result = CropTransformIntegration.applyCropToElement(mockImageElement, mockCropData);

      expect(result.cropData).toEqual(mockCropData);
      expect(result.updatedAt).toBeGreaterThan(mockImageElement.updatedAt);
    });

    it('should not modify non-image elements', () => {
      const textElement: LayerElement = {
        ...mockImageElement,
        type: 'text',
        content: 'Test text',
      };

      const result = CropTransformIntegration.applyCropToElement(textElement, mockCropData);

      expect(result).toEqual(textElement);
      expect(result.cropData).toBeUndefined();
    });

    it('should update element dimensions based on crop', () => {
      const result = CropTransformIntegration.applyCropToElement(mockImageElement, mockCropData);

      expect(result.width).toBe(mockCropData.width);
      expect(result.height).toBe(mockCropData.height);
    });
  });

  describe('resetCrop', () => {
    it('should reset crop to original dimensions', () => {
      const elementWithCrop: LayerElement = {
        ...mockImageElement,
        cropData: mockCropData,
      };

      const result = CropTransformIntegration.resetCrop(elementWithCrop);

      expect(result.cropData?.x).toBe(0);
      expect(result.cropData?.y).toBe(0);
      expect(result.cropData?.width).toBe(mockCropData.originalWidth);
      expect(result.cropData?.height).toBe(mockCropData.originalHeight);
    });

    it('should not modify elements without crop data', () => {
      const result = CropTransformIntegration.resetCrop(mockImageElement);

      expect(result).toEqual(mockImageElement);
    });

    it('should not modify non-image elements', () => {
      const textElement: LayerElement = {
        ...mockImageElement,
        type: 'text',
        content: 'Test text',
        cropData: mockCropData,
      };

      const result = CropTransformIntegration.resetCrop(textElement);

      expect(result).toEqual(textElement);
    });
  });

  describe('calculatePreviewTransform', () => {
    it('should calculate preview transform from crop', () => {
      const result = CropTransformIntegration.calculatePreviewTransform(mockTransformData, mockCropData);

      expect(result.width).toBe(mockCropData.width);
      expect(result.height).toBe(mockCropData.height);
    });

    it('should maintain original transform properties', () => {
      const transformWithRotation: TransformData = {
        ...mockTransformData,
        rotation: 30,
      };

      const result = CropTransformIntegration.calculatePreviewTransform(transformWithRotation, mockCropData);

      expect(result.rotation).toBe(30);
    });
  });

  describe('createModeTransition', () => {
    it('should create transition config for crop to transform', () => {
      const result = CropTransformIntegration.createModeTransition('crop', 'transform', mockImageElement);

      expect(result.duration).toBeGreaterThan(0);
      expect(result.easing).toBeDefined();
      expect(result.properties).toContain('transform');
      expect(result.properties).toContain('opacity');
    });

    it('should create transition config for transform to crop', () => {
      const result = CropTransformIntegration.createModeTransition('transform', 'crop', mockImageElement);

      expect(result.duration).toBeGreaterThan(0);
      expect(result.easing).toBeDefined();
      expect(result.properties).toContain('transform');
      expect(result.properties).toContain('opacity');
