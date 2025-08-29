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
    });

    it('should convert pure blue correctly', () => {
      const result = ColorConverter.hsvToRgb(240, 100, 100);
      expect(result).toEqual({ r: 0, g: 0, b: 255 });
    });

    it('should handle round-trip conversion accurately', () => {
      const original = { r: 123, g: 45, b: 200 };
      const hsv = ColorConverter.rgbToHsv(original.r, original.g, original.b);
      const converted = ColorConverter.hsvToRgb(hsv.h, hsv.s, hsv.v);
      
      expect(converted.r).toBeCloseTo(original.r, 0);
      expect(converted.g).toBeCloseTo(original.g, 0);
      expect(converted.b).toBeCloseTo(original.b, 0);
    });
  });

  describe('RGB to HSL conversion', () => {
    it('should convert pure red correctly', () => {
      const result = ColorConverter.rgbToHsl(255, 0, 0);
      expect(result).toEqual({ h: 0, s: 100, l: 50 });
    });

    it('should convert white correctly', () => {
      const result = ColorConverter.rgbToHsl(255, 255, 255);
      expect(result).toEqual({ h: 0, s: 0, l: 100 });
    });

    it('should convert black correctly', () => {
      const result = ColorConverter.rgbToHsl(0, 0, 0);
      expect(result).toEqual({ h: 0, s: 0, l: 0 });
    });
  });

  describe('Hex conversion', () => {
    it('should convert RGB to hex correctly', () => {
      expect(ColorConverter.rgbToHex(255, 0, 0)).toBe('#FF0000');
      expect(ColorConverter.rgbToHex(0, 255, 0)).toBe('#00FF00');
      expect(ColorConverter.rgbToHex(0, 0, 255)).toBe('#0000FF');
      expect(ColorConverter.rgbToHex(255, 255, 255)).toBe('#FFFFFF');
      expect(ColorConverter.rgbToHex(0, 0, 0)).toBe('#000000');
    });

    it('should convert hex to RGB correctly', () => {
      expect(ColorConverter.hexToRgb('#FF0000')).toEqual({ r: 255, g: 0, b: 0 });
      expect(ColorConverter.hexToRgb('#00FF00')).toEqual({ r: 0, g: 255, b: 0 });
      expect(ColorConverter.hexToRgb('#0000FF')).toEqual({ r: 0, g: 0, b: 255 });
      expect(ColorConverter.hexToRgb('#FFFFFF')).toEqual({ r: 255, g: 255, b: 255 });
      expect(ColorConverter.hexToRgb('#000000')).toEqual({ r: 0, g: 0, b: 0 });
    });

    it('should handle lowercase hex', () => {
      expect(ColorConverter.hexToRgb('#ff0000')).toEqual({ r: 255, g: 0, b: 0 });
    });

    it('should handle hex without hash', () => {
      expect(ColorConverter.hexToRgb('FF0000')).toEqual({ r: 255, g: 0, b: 0 });
