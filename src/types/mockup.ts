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
