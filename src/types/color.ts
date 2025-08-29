// Color type definitions for the photorealistic customize canvas

export interface TshirtColor {
  h: number; // Hue: 0-360
  s: number; // Saturation: 0-100
  v: number; // Value/Brightness: 0-100
  r: number; // Red: 0-255
  g: number; // Green: 0-255
  b: number; // Blue: 0-255
  hex: string; // Hex representation: #RRGGBB
  name?: string; // Optional color name
}

export interface HSLColor {
  h: number; // Hue: 0-360
  s: number; // Saturation: 0-100
  l: number; // Lightness: 0-100
}

export interface LABColor {
  l: number; // Lightness: 0-100
  a: number; // Green-Red axis: -128 to 127
  b: number; // Blue-Yellow axis: -128 to 127
}

export interface RGBColor {
