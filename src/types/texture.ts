// Texture filter type definitions

export interface TextureFilter {
  id: string;
  name: string;
  description: string;
  category: 'wash' | 'weave' | 'finish' | 'effect';
  cssFilter: string;
  canvasFilter?: CanvasFilterConfig;
  preview: string;
  intensity: number; // 0-100
  gpuAccelerated: boolean;
}

export interface CanvasFilterConfig {
  type: 'convolution' | 'color-matrix' | 'blend' | 'custom';
  kernel?: number[];
  matrix?: number[];
  blendMode?: GlobalCompositeOperation;
  customShader?: string;
