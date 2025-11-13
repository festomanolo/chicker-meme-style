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
  {
    id: 'regular-back',
    name: 'Regular T-Shirt Back',
    type: 'back',
    category: 'regular',
    variants: {
      '1x': `${MOCKUP_BASE_URL}/regular-back-1x.webp`,
      '2x': `${MOCKUP_BASE_URL}/regular-back-2x.webp`,
      '3x': `${MOCKUP_BASE_URL}/regular-back-3x.webp`,
    },
    maskUrl: `${MOCKUP_BASE_URL}/regular-back-mask.png`,
    designArea: {
      x: 160,
      y: 100,
      width: 200,
      height: 260,
      curvature: {
        points: [
          { x: 0, y: 0 },
          { x: 200, y: 0 },
          { x: 200, y: 260 },
          { x: 0, y: 260 },
        ],
        closed: true,
      },
    },
    metadata: {
      originalWidth: 520,
      originalHeight: 600,
      designAreaRatio: 0.42,
      shadowIntensity: 0.25,
      fabricTexture: 'cotton-medium',
    },
  },
];

// Long sleeve mockups
export const LONGSLEEVE_MOCKUPS: TshirtMockup[] = [
  {
    id: 'longsleeve-front',
    name: 'Long Sleeve T-Shirt Front',
    type: 'front',
    category: 'longsleeve',
    variants: {
      '1x': `${MOCKUP_BASE_URL}/longsleeve-front-1x.webp`,
      '2x': `${MOCKUP_BASE_URL}/longsleeve-front-2x.webp`,
      '3x': `${MOCKUP_BASE_URL}/longsleeve-front-3x.webp`,
    },
    maskUrl: `${MOCKUP_BASE_URL}/longsleeve-front-mask.png`,
    designArea: {
      x: 160,
      y: 120,
      width: 200,
      height: 240,
      curvature: {
        points: [
          { x: 0, y: 0 },
          { x: 200, y: 0, cp1: { x: 50, y: -8 }, cp2: { x: 150, y: -8 } },
          { x: 200, y: 240, cp1: { x: 208, y: 80 }, cp2: { x: 208, y: 160 } },
          { x: 0, y: 240, cp1: { x: -8, y: 160 }, cp2: { x: -8, y: 80 } },
        ],
        closed: true,
      },
    },
    metadata: {
      originalWidth: 520,
      originalHeight: 600,
      designAreaRatio: 0.38,
      shadowIntensity: 0.35,
      fabricTexture: 'cotton-medium',
    },
  },
  {
    id: 'longsleeve-back',
    name: 'Long Sleeve T-Shirt Back',
    type: 'back',
    category: 'longsleeve',
    variants: {
      '1x': `${MOCKUP_BASE_URL}/longsleeve-back-1x.webp`,
      '2x': `${MOCKUP_BASE_URL}/longsleeve-back-2x.webp`,
      '3x': `${MOCKUP_BASE_URL}/longsleeve-back-3x.webp`,
