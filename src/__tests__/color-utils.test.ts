// Unit tests for color conversion utilities
import { 
  ColorConverter, 
  ColorValidator, 
  ColorManipulator,
  createTshirtColor,
  createTshirtColorFromHex,
  createTshirtColorFromHsv,
  validateTshirtColor,
  convertColorSpace
} from '@/lib/color-utils';
import { TshirtColor } from '@/types/color';

describe('ColorConverter', () => {
  describe('RGB to HSV conversion', () => {
    it('should convert pure red correctly', () => {
      const result = ColorConverter.rgbToHsv(255, 0, 0);
      expect(result).toEqual({ h: 0, s: 100, v: 100 });
    });

    it('should convert pure green correctly', () => {
      const result = ColorConverter.rgbToHsv(0, 255, 0);
      expect(result).toEqual({ h: 120, s: 100, v: 100 });
    });

    it('should convert pure blue correctly', () => {
      const result = ColorConverter.rgbToHsv(0, 0, 255);
      expect(result).toEqual({ h: 240, s: 100, v: 100 });
    });

    it('should convert white correctly', () => {
      const result = ColorConverter.rgbToHsv(255, 255, 255);
      expect(result).toEqual({ h: 0, s: 0, v: 100 });
    });

    it('should convert black correctly', () => {
      const result = ColorConverter.rgbToHsv(0, 0, 0);
      expect(result).toEqual({ h: 0, s: 0, v: 0 });
    });

    it('should convert gray correctly', () => {
      const result = ColorConverter.rgbToHsv(128, 128, 128);
      expect(result.h).toBe(0);
      expect(result.s).toBe(0);
      expect(result.v).toBeCloseTo(50, 0);
    });
  });

  describe('HSV to RGB conversion', () => {
    it('should convert pure red correctly', () => {
      const result = ColorConverter.hsvToRgb(0, 100, 100);
      expect(result).toEqual({ r: 255, g: 0, b: 0 });
    });

    it('should convert pure green correctly', () => {
      const result = ColorConverter.hsvToRgb(120, 100, 100);
      expect(result).toEqual({ r: 0, g: 255, b: 0 });
