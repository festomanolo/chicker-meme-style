// Predefined texture filters for fabric effects
import { TextureFilter } from '@/types/texture';

export const TEXTURE_FILTERS: TextureFilter[] = [
  // Wash effects
  {
    id: 'light-wash',
    name: 'Light Wash',
    description: 'Subtle faded appearance with light wear patterns',
    category: 'wash',
    cssFilter: 'brightness(1.1) contrast(0.9) saturate(0.8)',
    canvasFilter: {
      type: 'color-matrix',
      matrix: [
        1.1, 0, 0, 0, 10,
        0, 1.1, 0, 0, 10,
        0, 0, 1.1, 0, 10,
        0, 0, 0, 1, 0
      ],
    },
    preview: '/assets/textures/light-wash-preview.webp',
    intensity: 30,
    gpuAccelerated: true,
  },
  {
    id: 'heavy-wash',
    name: 'Heavy Wash',
    description: 'Heavily faded with pronounced wear patterns',
    category: 'wash',
    cssFilter: 'brightness(1.2) contrast(0.7) saturate(0.6) sepia(0.1)',
    canvasFilter: {
      type: 'color-matrix',
      matrix: [
        1.2, 0, 0, 0, 20,
        0, 1.2, 0, 0, 20,
        0, 0, 1.2, 0, 20,
        0, 0, 0, 1, 0
      ],
    },
    preview: '/assets/textures/heavy-wash-preview.webp',
    intensity: 60,
    gpuAccelerated: true,
  },
  {
    id: 'acid-wash',
    name: 'Acid Wash',
    description: 'Irregular bleached patterns with high contrast',
    category: 'wash',
    cssFilter: 'brightness(1.3) contrast(1.4) saturate(0.4) hue-rotate(10deg)',
    canvasFilter: {
      type: 'custom',
      customShader: 'acid-wash-shader',
    },
