// Photorealistic T-shirt mockup type definitions

export interface TshirtMockup {
  id: string;
  name: string;
  type: 'front' | 'back';
  category: 'regular' | 'longsleeve' | 'hoodie' | 'tank';
  variants: {
    '1x': string;
    '2x': string;
    '3x': string;
  };
  maskUrl: string;
  designArea: {
    x: number;
    y: number;
    width: number;
    height: number;
    curvature: BezierPath;
  };
  metadata: {
    originalWidth: number;
    originalHeight: number;
    designAreaRatio: number;
    shadowIntensity: number;
    fabricTexture: string;
  };
}

export interface BezierPath {
  points: BezierPoint[];
  closed: boolean;
}

export interface BezierPoint {
  x: number;
  y: number;
  cp1?: { x: number; y: number }; // Control point 1
  cp2?: { x: number; y: number }; // Control point 2
}

export interface MockupAssetInfo {
  url: string;
  width: number;
  height: number;
  loaded: boolean;
  error?: string;
}

export interface MockupLoadOptions {
  preferredResolution: '1x' | '2x' | '3x';
  fallbackResolution?: '1x' | '2x' | '3x';
  timeout?: number;
  retryCount?: number;
}

export interface MockupValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}