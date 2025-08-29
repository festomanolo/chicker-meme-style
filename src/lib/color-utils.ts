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

