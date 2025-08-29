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
    });

    it('should return null for invalid hex', () => {
      expect(ColorConverter.hexToRgb('#GGGGGG')).toBeNull();
      expect(ColorConverter.hexToRgb('#FF')).toBeNull();
      expect(ColorConverter.hexToRgb('invalid')).toBeNull();
    });
  });

  describe('TshirtColor creation', () => {
    it('should create complete TshirtColor from RGB', () => {
      const color = ColorConverter.createTshirtColor(255, 0, 0, 'Red');
      
      expect(color.r).toBe(255);
      expect(color.g).toBe(0);
      expect(color.b).toBe(0);
      expect(color.h).toBe(0);
      expect(color.s).toBe(100);
      expect(color.v).toBe(100);
      expect(color.hex).toBe('#FF0000');
      expect(color.name).toBe('Red');
    });

    it('should create TshirtColor from HSV', () => {
      const color = ColorConverter.createTshirtColorFromHsv(120, 100, 100, 'Green');
      
      expect(color.r).toBe(0);
      expect(color.g).toBe(255);
      expect(color.b).toBe(0);
      expect(color.h).toBe(120);
      expect(color.s).toBe(100);
      expect(color.v).toBe(100);
      expect(color.hex).toBe('#00FF00');
      expect(color.name).toBe('Green');
    });

    it('should create TshirtColor from hex', () => {
      const color = ColorConverter.createTshirtColorFromHex('#0000FF', 'Blue');
      
      expect(color).not.toBeNull();
      expect(color!.r).toBe(0);
      expect(color!.g).toBe(0);
      expect(color!.b).toBe(255);
      expect(color!.h).toBe(240);
      expect(color!.s).toBe(100);
      expect(color!.v).toBe(100);
      expect(color!.hex).toBe('#0000FF');
      expect(color!.name).toBe('Blue');
    });

    it('should return null for invalid hex', () => {
      const color = ColorConverter.createTshirtColorFromHex('#INVALID');
      expect(color).toBeNull();
    });
  });

  describe('Color space conversion', () => {
    it('should convert between RGB and HSV', () => {
      const rgb = { r: 255, g: 128, b: 64 };
      const hsv = convertColorSpace(rgb, 'rgb', 'hsv');
      const backToRgb = convertColorSpace(hsv, 'hsv', 'rgb');
      
      expect(backToRgb.r).toBeCloseTo(rgb.r, 0);
      expect(backToRgb.g).toBeCloseTo(rgb.g, 0);
      expect(backToRgb.b).toBeCloseTo(rgb.b, 0);
    });

    it('should convert from hex to RGB', () => {
      const result = convertColorSpace('#FF8040', 'hex', 'rgb');
      expect(result).toEqual({ r: 255, g: 128, b: 64 });
    });

    it('should return same value for same color space', () => {
      const rgb = { r: 255, g: 128, b: 64 };
      const result = convertColorSpace(rgb, 'rgb', 'rgb');
      expect(result).toEqual(rgb);
    });

    it('should throw error for unsupported color space', () => {
      const rgb = { r: 255, g: 128, b: 64 };
      expect(() => convertColorSpace(rgb, 'invalid' as any, 'rgb')).toThrow();
      expect(() => convertColorSpace(rgb, 'rgb', 'invalid' as any)).toThrow();
    });
  });
});

describe('ColorValidator', () => {
  describe('TshirtColor validation', () => {
    it('should validate correct TshirtColor', () => {
      const color: TshirtColor = {
        r: 255, g: 128, b: 64,
        h: 20, s: 75, v: 100,
        hex: '#FF8040'
      };
      
      const result = validateTshirtColor(color);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.normalized).toBeDefined();
    });

    it('should detect invalid RGB values', () => {
      const color = {
        r: 300, g: -10, b: 64,
        h: 20, s: 75, v: 100,
        hex: '#FF8040'
      };
      
      const result = validateTshirtColor(color);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Red value must be between 0 and 255');
      expect(result.errors).toContain('Green value must be between 0 and 255');
    });

    it('should detect invalid HSV values', () => {
      const color = {
        r: 255, g: 128, b: 64,
        h: 400, s: 150, v: -10,
        hex: '#FF8040'
      };
      
      const result = validateTshirtColor(color);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Hue value must be between 0 and 360');
      expect(result.errors).toContain('Saturation value must be between 0 and 100');
      expect(result.errors).toContain('Value/Brightness must be between 0 and 100');
    });
  });

  describe('Hex validation', () => {
    it('should validate correct hex colors', () => {
      expect(ColorValidator.validateHexColor('#FF0000')).toBe(true);
      expect(ColorValidator.validateHexColor('#00FF00')).toBe(true);
      expect(ColorValidator.validateHexColor('#0000FF')).toBe(true);
      expect(ColorValidator.validateHexColor('#FFF')).toBe(true);
      expect(ColorValidator.validateHexColor('#000')).toBe(true);
    });

    it('should reject invalid hex colors', () => {
      expect(ColorValidator.validateHexColor('#GGGGGG')).toBe(false);
      expect(ColorValidator.validateHexColor('#FF')).toBe(false);
      expect(ColorValidator.validateHexColor('FF0000')).toBe(false);
      expect(ColorValidator.validateHexColor('#FFFFFFF')).toBe(false);
      expect(ColorValidator.validateHexColor('invalid')).toBe(false);
    });
  });

  describe('RGB validation', () => {
    it('should validate correct RGB values', () => {
      expect(ColorValidator.validateRgbValues(255, 128, 64)).toBe(true);
      expect(ColorValidator.validateRgbValues(0, 0, 0)).toBe(true);
      expect(ColorValidator.validateRgbValues(255, 255, 255)).toBe(true);
    });

    it('should reject invalid RGB values', () => {
      expect(ColorValidator.validateRgbValues(-1, 128, 64)).toBe(false);
      expect(ColorValidator.validateRgbValues(255, 256, 64)).toBe(false);
      expect(ColorValidator.validateRgbValues(255, 128, -1)).toBe(false);
    });
  });

  describe('HSV validation', () => {
    it('should validate correct HSV values', () => {
      expect(ColorValidator.validateHsvValues(180, 50, 75)).toBe(true);
      expect(ColorValidator.validateHsvValues(0, 0, 0)).toBe(true);
      expect(ColorValidator.validateHsvValues(360, 100, 100)).toBe(true);
    });

    it('should reject invalid HSV values', () => {
      expect(ColorValidator.validateHsvValues(-1, 50, 75)).toBe(false);
      expect(ColorValidator.validateHsvValues(361, 50, 75)).toBe(false);
      expect(ColorValidator.validateHsvValues(180, -1, 75)).toBe(false);
      expect(ColorValidator.validateHsvValues(180, 101, 75)).toBe(false);
      expect(ColorValidator.validateHsvValues(180, 50, -1)).toBe(false);
      expect(ColorValidator.validateHsvValues(180, 50, 101)).toBe(false);
    });
  });
});

describe('ColorManipulator', () => {
  const testColor = createTshirtColor(255, 128, 64, 'Orange');

  describe('Lightening and darkening', () => {
    it('should lighten color correctly', () => {
      const lightened = ColorManipulator.lighten(testColor, 0.2);
      expect(lightened.v).toBeGreaterThan(testColor.v);
      expect(lightened.h).toBe(testColor.h);
      expect(lightened.s).toBe(testColor.s);
    });

    it('should darken color correctly', () => {
      const darkened = ColorManipulator.darken(testColor, 0.2);
      expect(darkened.v).toBeLessThan(testColor.v);
      expect(darkened.h).toBe(testColor.h);
      expect(darkened.s).toBe(testColor.s);
    });

    it('should not exceed bounds when lightening', () => {
      const lightened = ColorManipulator.lighten(testColor, 1.0);
      expect(lightened.v).toBeLessThanOrEqual(100);
    });

    it('should not go below bounds when darkening', () => {
      const darkened = ColorManipulator.darken(testColor, 1.0);
      expect(darkened.v).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Saturation adjustment', () => {
    it('should saturate color correctly', () => {
      const saturated = ColorManipulator.saturate(testColor, 0.2);
      expect(saturated.s).toBeGreaterThan(testColor.s);
      expect(saturated.h).toBe(testColor.h);
      expect(saturated.v).toBe(testColor.v);
    });

    it('should desaturate color correctly', () => {
      const desaturated = ColorManipulator.desaturate(testColor, 0.2);
      expect(desaturated.s).toBeLessThan(testColor.s);
      expect(desaturated.h).toBe(testColor.h);
      expect(desaturated.v).toBe(testColor.v);
    });
  });

  describe('Hue adjustment', () => {
    it('should adjust hue correctly', () => {
      const adjusted = ColorManipulator.adjustHue(testColor, 90);
      expect(adjusted.h).toBe((testColor.h + 90) % 360);
      expect(adjusted.s).toBe(testColor.s);
      expect(adjusted.v).toBe(testColor.v);
    });

    it('should handle negative hue adjustment', () => {
      const adjusted = ColorManipulator.adjustHue(testColor, -90);
      expect(adjusted.h).toBe((testColor.h - 90 + 360) % 360);
    });

    it('should get complementary color', () => {
      const complementary = ColorManipulator.getComplementary(testColor);
      expect(complementary.h).toBe((testColor.h + 180) % 360);
    });
  });

  describe('Color relationships', () => {
    it('should get triadic colors', () => {
      const [triadic1, triadic2] = ColorManipulator.getTriadic(testColor);
      expect(triadic1.h).toBe((testColor.h + 120) % 360);
      expect(triadic2.h).toBe((testColor.h + 240) % 360);
    });

    it('should get analogous colors', () => {
      const [analogous1, analogous2] = ColorManipulator.getAnalogous(testColor);
      expect(analogous1.h).toBe((testColor.h + 30) % 360);
      expect(analogous2.h).toBe((testColor.h - 30 + 360) % 360);
    });
  });

  describe('Contrast and readability', () => {
    it('should calculate contrast ratio', () => {
      const white = createTshirtColor(255, 255, 255, 'White');
      const black = createTshirtColor(0, 0, 0, 'Black');
      
      const contrast = ColorManipulator.getContrastRatio(white, black);
      expect(contrast).toBeCloseTo(21, 0); // Maximum contrast ratio
    });

    it('should identify light colors', () => {
      const white = createTshirtColor(255, 255, 255, 'White');
      const black = createTshirtColor(0, 0, 0, 'Black');
      
      expect(ColorManipulator.isLight(white)).toBe(true);
      expect(ColorManipulator.isLight(black)).toBe(false);
    });

    it('should get readable text color', () => {
      const white = createTshirtColor(255, 255, 255, 'White');
      const black = createTshirtColor(0, 0, 0, 'Black');
      
      const textForWhite = ColorManipulator.getReadableTextColor(white);
      const textForBlack = ColorManipulator.getReadableTextColor(black);
      
      expect(textForWhite.r).toBe(0); // Should be black text on white
      expect(textForBlack.r).toBe(255); // Should be white text on black
    });
  });
});