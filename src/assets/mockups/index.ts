// Photorealistic T-shirt mockup asset definitions
import { TshirtMockup } from '@/types/mockup';

// Placeholder URLs - these would be replaced with actual photorealistic mockup images
const MOCKUP_BASE_URL = '/assets/mockups';

export const PHOTOREALISTIC_MOCKUPS: TshirtMockup[] = [
  {
    id: 'regular-front',
    name: 'Regular T-Shirt Front',
    type: 'front',
    category: 'regular',
    variants: {
      '1x': `${MOCKUP_BASE_URL}/regular-front-1x.webp`,
      '2x': `${MOCKUP_BASE_URL}/regular-front-2x.webp`,
      '3x': `${MOCKUP_BASE_URL}/regular-front-3x.webp`,
    },
    maskUrl: `${MOCKUP_BASE_URL}/regular-front-mask.png`,
    designArea: {
      x: 160,
      y: 120,
      width: 200,
      height: 240,
      curvature: {
        points: [
          { x: 0, y: 0 },
          { x: 200, y: 0, cp1: { x: 50, y: -10 }, cp2: { x: 150, y: -10 } },
          { x: 200, y: 240, cp1: { x: 210, y: 80 }, cp2: { x: 210, y: 160 } },
          { x: 0, y: 240, cp1: { x: -10, y: 160 }, cp2: { x: -10, y: 80 } },
        ],
        closed: true,
      },
    },
    metadata: {
      originalWidth: 520,
      originalHeight: 600,
      designAreaRatio: 0.38,
      shadowIntensity: 0.3,
      fabricTexture: 'cotton-medium',
    },
  },
