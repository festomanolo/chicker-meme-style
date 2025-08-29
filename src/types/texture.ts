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
}

export interface FabricBlendOptions {
  baseColor: string;
  overlayColor: string;
  blendMode: 'multiply' | 'overlay' | 'soft-light' | 'color-burn' | 'linear-burn';
  opacity: number;
  preserveHighlights: boolean;
  preserveShadows: boolean;
}

export interface ColorBlendResult {
  blendedColor: string;
  cssFilter: string;
  performanceMetrics: {
    blendTime: number;
    method: 'css' | 'canvas' | 'webgl';
  };
}