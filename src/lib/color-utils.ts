// Color space conversion utilities
import { TshirtColor, HSLColor, LABColor, RGBColor, HSVColor, ColorSpace, ColorValidationResult } from '@/types/color';

/**
 * Color conversion utilities for photorealistic t-shirt customization
 */
export class ColorConverter {
  /**
   * Convert RGB to HSV color space
   */
  static rgbToHsv(r: number, g: number, b: number): HSVColor {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const diff = max - min;

    let h = 0;
    let s = max === 0 ? 0 : diff / max;
    let v = max;

    if (diff !== 0) {
      switch (max) {
        case r:
          h = ((g - b) / diff + (g < b ? 6 : 0)) / 6;
          break;
        case g:
          h = ((b - r) / diff + 2) / 6;
          break;
        case b:
          h = ((r - g) / diff + 4) / 6;
          break;
      }
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      v: Math.round(v * 100),
    };
  }

  /**
   * Convert HSV to RGB color space
   */
  static hsvToRgb(h: number, s: number, v: number): RGBColor {
    h = h / 360;
    s = s / 100;
    v = v / 100;

    const c = v * s;
    const x = c * (1 - Math.abs(((h * 6) % 2) - 1));
    const m = v - c;

    let r = 0, g = 0, b = 0;

    if (h >= 0 && h < 1/6) {
      r = c; g = x; b = 0;
    } else if (h >= 1/6 && h < 2/6) {
      r = x; g = c; b = 0;
    } else if (h >= 2/6 && h < 3/6) {
      r = 0; g = c; b = x;
    } else if (h >= 3/6 && h < 4/6) {
      r = 0; g = x; b = c;
    } else if (h >= 4/6 && h < 5/6) {
      r = x; g = 0; b = c;
    } else if (h >= 5/6 && h < 1) {
      r = c; g = 0; b = x;
    }

    return {
      r: Math.round((r + m) * 255),
      g: Math.round((g + m) * 255),
      b: Math.round((b + m) * 255),
    };
  }

  /**
   * Convert RGB to HSL color space
   */
  static rgbToHsl(r: number, g: number, b: number): HSLColor {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const diff = max - min;

    let h = 0;
    let s = 0;
    let l = (max + min) / 2;

    if (diff !== 0) {
      s = l > 0.5 ? diff / (2 - max - min) : diff / (max + min);

      switch (max) {
        case r:
          h = ((g - b) / diff + (g < b ? 6 : 0)) / 6;
          break;
        case g:
          h = ((b - r) / diff + 2) / 6;
          break;
        case b:
          h = ((r - g) / diff + 4) / 6;
          break;
      }
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    };
  }

  /**
   * Convert HSL to RGB color space
   */
  static hslToRgb(h: number, s: number, l: number): RGBColor {
    h = h / 360;
    s = s / 100;
    l = l / 100;

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h * 6) % 2) - 1));
    const m = l - c / 2;

    let r = 0, g = 0, b = 0;

    if (h >= 0 && h < 1/6) {
      r = c; g = x; b = 0;
    } else if (h >= 1/6 && h < 2/6) {
      r = x; g = c; b = 0;
    } else if (h >= 2/6 && h < 3/6) {
      r = 0; g = c; b = x;
    } else if (h >= 3/6 && h < 4/6) {
      r = 0; g = x; b = c;
    } else if (h >= 4/6 && h < 5/6) {
      r = x; g = 0; b = c;
    } else if (h >= 5/6 && h < 1) {
      r = c; g = 0; b = x;
    }

    return {
      r: Math.round((r + m) * 255),
      g: Math.round((g + m) * 255),
      b: Math.round((b + m) * 255),
    };
  }

  /**
   * Convert RGB to LAB color space (simplified conversion)
   */
  static rgbToLab(r: number, g: number, b: number): LABColor {
    // Convert RGB to XYZ first
    r = r / 255;
    g = g / 255;
    b = b / 255;

    // Apply gamma correction
    r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
    g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
    b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;

    // Convert to XYZ using sRGB matrix
    let x = r * 0.4124564 + g * 0.3575761 + b * 0.1804375;
    let y = r * 0.2126729 + g * 0.7151522 + b * 0.0721750;
    let z = r * 0.0193339 + g * 0.1191920 + b * 0.9503041;

    // Normalize for D65 illuminant
    x = x / 0.95047;
    y = y / 1.00000;
    z = z / 1.08883;

    // Convert XYZ to LAB
    x = x > 0.008856 ? Math.pow(x, 1/3) : (7.787 * x + 16/116);
    y = y > 0.008856 ? Math.pow(y, 1/3) : (7.787 * y + 16/116);
    z = z > 0.008856 ? Math.pow(z, 1/3) : (7.787 * z + 16/116);

    return {
      l: Math.round((116 * y) - 16),
      a: Math.round(500 * (x - y)),
      b: Math.round(200 * (y - z)),
    };
  }

  /**
   * Convert RGB to hex string
   */
  static rgbToHex(r: number, g: number, b: number): string {
    const toHex = (n: number) => {
      const hex = Math.round(Math.max(0, Math.min(255, n))).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
  }

  /**
   * Convert hex string to RGB
   */
  static hexToRgb(hex: string): RGBColor | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    } : null;
  }

  /**
   * Create a complete TshirtColor object from RGB values
   */
  static createTshirtColor(r: number, g: number, b: number, name?: string): TshirtColor {
    const hsv = this.rgbToHsv(r, g, b);
    const hex = this.rgbToHex(r, g, b);

    return {
      h: hsv.h,
      s: hsv.s,
      v: hsv.v,
      r: Math.round(r),
      g: Math.round(g),
      b: Math.round(b),
      hex,
      name,
    };
  }

  /**
   * Create TshirtColor from HSV values
   */
  static createTshirtColorFromHsv(h: number, s: number, v: number, name?: string): TshirtColor {
    const rgb = this.hsvToRgb(h, s, v);
    return this.createTshirtColor(rgb.r, rgb.g, rgb.b, name);
  }

  /**
   * Create TshirtColor from hex string
   */
  static createTshirtColorFromHex(hex: string, name?: string): TshirtColor | null {
    const rgb = this.hexToRgb(hex);
    if (!rgb) return null;
    return this.createTshirtColor(rgb.r, rgb.g, rgb.b, name);
  }

  /**
   * Convert between color spaces
   */
  static convertColorSpace(color: any, from: ColorSpace, to: ColorSpace): any {
    if (from === to) return color;

    // Convert to RGB first as intermediate format
    let rgb: RGBColor;

    switch (from) {
      case 'rgb':
        rgb = color as RGBColor;
        break;
      case 'hsv':
        rgb = this.hsvToRgb(color.h, color.s, color.v);
        break;
      case 'hsl':
        rgb = this.hslToRgb(color.h, color.s, color.l);
        break;
      case 'hex':
        const hexRgb = this.hexToRgb(color);
        if (!hexRgb) throw new Error('Invalid hex color');
        rgb = hexRgb;
        break;
      default:
        throw new Error(`Unsupported source color space: ${from}`);
    }

    // Convert from RGB to target format
    switch (to) {
      case 'rgb':
        return rgb;
      case 'hsv':
        return this.rgbToHsv(rgb.r, rgb.g, rgb.b);
      case 'hsl':
        return this.rgbToHsl(rgb.r, rgb.g, rgb.b);
      case 'lab':
        return this.rgbToLab(rgb.r, rgb.g, rgb.b);
      case 'hex':
        return this.rgbToHex(rgb.r, rgb.g, rgb.b);
      default:
        throw new Error(`Unsupported target color space: ${to}`);
    }
  }
}/**
 * C
olor validation and normalization utilities
 */
export class ColorValidator {
  /**
   * Validate and normalize a TshirtColor object
   */
  static validateTshirtColor(color: Partial<TshirtColor>): ColorValidationResult {
    const errors: string[] = [];

    // Check required properties
    if (typeof color.r !== 'number' || color.r < 0 || color.r > 255) {
      errors.push('Red value must be between 0 and 255');
    }
    if (typeof color.g !== 'number' || color.g < 0 || color.g > 255) {
      errors.push('Green value must be between 0 and 255');
    }
    if (typeof color.b !== 'number' || color.b < 0 || color.b > 255) {
      errors.push('Blue value must be between 0 and 255');
    }
    if (typeof color.h !== 'number' || color.h < 0 || color.h > 360) {
      errors.push('Hue value must be between 0 and 360');
    }
    if (typeof color.s !== 'number' || color.s < 0 || color.s > 100) {
      errors.push('Saturation value must be between 0 and 100');
    }
    if (typeof color.v !== 'number' || color.v < 0 || color.v > 100) {
      errors.push('Value/Brightness must be between 0 and 100');
    }

    if (errors.length > 0) {
      return { isValid: false, errors };
    }

    // Normalize and create complete color object
    const normalized = ColorConverter.createTshirtColor(
      Math.round(color.r!),
      Math.round(color.g!),
      Math.round(color.b!),
      color.name
    );

    return {
      isValid: true,
      errors: [],
      normalized,
    };
  }

  /**
   * Validate hex color string
   */
  static validateHexColor(hex: string): boolean {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
  }

  /**
   * Validate RGB values
   */
  static validateRgbValues(r: number, g: number, b: number): boolean {
    return (
      r >= 0 && r <= 255 &&
      g >= 0 && g <= 255 &&
      b >= 0 && b <= 255
    );
  }

  /**
   * Validate HSV values
   */
  static validateHsvValues(h: number, s: number, v: number): boolean {
    return (
      h >= 0 && h <= 360 &&
      s >= 0 && s <= 100 &&
      v >= 0 && v <= 100
    );
  }
}

/**
 * Color manipulation utilities
 */
export class ColorManipulator {
  /**
   * Lighten a color by a percentage
   */
  static lighten(color: TshirtColor, percentage: number): TshirtColor {
    const newV = Math.min(100, color.v + (percentage * 100));
    return ColorConverter.createTshirtColorFromHsv(color.h, color.s, newV, color.name);
  }

  /**
   * Darken a color by a percentage
   */
  static darken(color: TshirtColor, percentage: number): TshirtColor {
    const newV = Math.max(0, color.v - (percentage * 100));
    return ColorConverter.createTshirtColorFromHsv(color.h, color.s, newV, color.name);
  }

  /**
   * Saturate a color by a percentage
   */
  static saturate(color: TshirtColor, percentage: number): TshirtColor {
    const newS = Math.min(100, color.s + (percentage * 100));
    return ColorConverter.createTshirtColorFromHsv(color.h, newS, color.v, color.name);
  }

  /**
   * Desaturate a color by a percentage
   */
  static desaturate(color: TshirtColor, percentage: number): TshirtColor {
    const newS = Math.max(0, color.s - (percentage * 100));
    return ColorConverter.createTshirtColorFromHsv(color.h, newS, color.v, color.name);
  }

  /**
   * Adjust hue by degrees
   */
  static adjustHue(color: TshirtColor, degrees: number): TshirtColor {
    const newH = (color.h + degrees + 360) % 360;
    return ColorConverter.createTshirtColorFromHsv(newH, color.s, color.v, color.name);
  }

  /**
   * Get complementary color
   */
  static getComplementary(color: TshirtColor): TshirtColor {
    return this.adjustHue(color, 180);
  }

  /**
   * Get triadic colors
   */
  static getTriadic(color: TshirtColor): [TshirtColor, TshirtColor] {
    return [
      this.adjustHue(color, 120),
      this.adjustHue(color, 240),
    ];
  }

  /**
   * Get analogous colors
   */
  static getAnalogous(color: TshirtColor): [TshirtColor, TshirtColor] {
    return [
      this.adjustHue(color, 30),
      this.adjustHue(color, -30),
    ];
  }

  /**
   * Calculate color contrast ratio
   */
  static getContrastRatio(color1: TshirtColor, color2: TshirtColor): number {
    const getLuminance = (color: TshirtColor) => {
      const [r, g, b] = [color.r, color.g, color.b].map(c => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };

    const lum1 = getLuminance(color1);
    const lum2 = getLuminance(color2);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);

    return (brightest + 0.05) / (darkest + 0.05);
  }

  /**
   * Check if color is light or dark
   */
  static isLight(color: TshirtColor): boolean {
    const luminance = (0.299 * color.r + 0.587 * color.g + 0.114 * color.b) / 255;
    return luminance > 0.5;
  }

  /**
   * Get readable text color for background
   */
  static getReadableTextColor(backgroundColor: TshirtColor): TshirtColor {
    return this.isLight(backgroundColor) 
      ? ColorConverter.createTshirtColor(0, 0, 0, 'Black')
      : ColorConverter.createTshirtColor(255, 255, 255, 'White');
  }
}

// Export utility functions
export const createTshirtColor = ColorConverter.createTshirtColor;
export const createTshirtColorFromHex = ColorConverter.createTshirtColorFromHex;
export const createTshirtColorFromHsv = ColorConverter.createTshirtColorFromHsv;
export const validateTshirtColor = ColorValidator.validateTshirtColor;
export const convertColorSpace = ColorConverter.convertColorSpace;