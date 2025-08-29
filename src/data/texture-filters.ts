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
    preview: '/assets/textures/acid-wash-preview.webp',
    intensity: 80,
    gpuAccelerated: true,
  },

  // Weave effects
  {
    id: 'fine-weave',
    name: 'Fine Weave',
    description: 'Tight, smooth fabric texture with minimal visible weave',
    category: 'weave',
    cssFilter: 'contrast(1.05) brightness(0.98)',
    canvasFilter: {
      type: 'convolution',
      kernel: [
        0, -0.1, 0,
        -0.1, 1.4, -0.1,
        0, -0.1, 0
      ],
    },
    preview: '/assets/textures/fine-weave-preview.webp',
    intensity: 20,
    gpuAccelerated: false,
  },
  {
    id: 'medium-weave',
    name: 'Medium Weave',
    description: 'Standard cotton weave with visible texture',
    category: 'weave',
    cssFilter: 'contrast(1.1) brightness(0.95)',
    canvasFilter: {
      type: 'convolution',
      kernel: [
        -0.1, -0.1, -0.1,
        -0.1, 1.8, -0.1,
        -0.1, -0.1, -0.1
      ],
    },
    preview: '/assets/textures/medium-weave-preview.webp',
    intensity: 40,
    gpuAccelerated: false,
  },
  {
    id: 'heavy-weave',
    name: 'Heavy Weave',
    description: 'Coarse, textured fabric with pronounced weave pattern',
    category: 'weave',
    cssFilter: 'contrast(1.2) brightness(0.9) saturate(1.1)',
    canvasFilter: {
      type: 'convolution',
      kernel: [
        -0.2, -0.2, -0.2,
        -0.2, 2.6, -0.2,
        -0.2, -0.2, -0.2
      ],
    },
    preview: '/assets/textures/heavy-weave-preview.webp',
    intensity: 70,
    gpuAccelerated: false,
  },

  // Finish effects
  {
    id: 'matte-finish',
    name: 'Matte Finish',
    description: 'Non-reflective surface with reduced shine',
    category: 'finish',
    cssFilter: 'brightness(0.95) contrast(1.05) saturate(0.9)',
    canvasFilter: {
      type: 'color-matrix',
      matrix: [
        0.95, 0, 0, 0, 0,
        0, 0.95, 0, 0, 0,
        0, 0, 0.95, 0, 0,
        0, 0, 0, 1, 0
      ],
    },
    preview: '/assets/textures/matte-finish-preview.webp',
    intensity: 25,
    gpuAccelerated: true,
  },
  {
    id: 'satin-finish',
    name: 'Satin Finish',
    description: 'Subtle sheen with smooth appearance',
    category: 'finish',
    cssFilter: 'brightness(1.05) contrast(1.1) saturate(1.05)',
    canvasFilter: {
      type: 'color-matrix',
      matrix: [
        1.05, 0, 0, 0, 5,
        0, 1.05, 0, 0, 5,
        0, 0, 1.05, 0, 5,
        0, 0, 0, 1, 0
      ],
    },
    preview: '/assets/textures/satin-finish-preview.webp',
    intensity: 35,
    gpuAccelerated: true,
  },
  {
    id: 'glossy-finish',
    name: 'Glossy Finish',
    description: 'High shine with reflective surface',
    category: 'finish',
    cssFilter: 'brightness(1.1) contrast(1.2) saturate(1.1)',
    canvasFilter: {
      type: 'color-matrix',
      matrix: [
        1.1, 0, 0, 0, 10,
        0, 1.1, 0, 0, 10,
        0, 0, 1.1, 0, 10,
        0, 0, 0, 1, 0
      ],
    },
    preview: '/assets/textures/glossy-finish-preview.webp',
    intensity: 50,
    gpuAccelerated: true,
  },

  // Special effects
  {
    id: 'vintage',
    name: 'Vintage',
    description: 'Aged appearance with warm tones and soft contrast',
    category: 'effect',
    cssFilter: 'sepia(0.3) brightness(1.1) contrast(0.8) saturate(0.7) hue-rotate(15deg)',
    canvasFilter: {
      type: 'color-matrix',
      matrix: [
        0.8, 0.2, 0.1, 0, 15,
        0.1, 0.8, 0.1, 0, 10,
        0.1, 0.1, 0.7, 0, 5,
        0, 0, 0, 1, 0
      ],
    },
    preview: '/assets/textures/vintage-preview.webp',
    intensity: 45,
    gpuAccelerated: true,
  },
  {
    id: 'heather',
    name: 'Heather',
    description: 'Mixed fiber appearance with subtle color variation',
    category: 'effect',
    cssFilter: 'contrast(0.9) brightness(1.05) saturate(0.85)',
    canvasFilter: {
      type: 'custom',
      customShader: 'heather-shader',
    },
    preview: '/assets/textures/heather-preview.webp',
    intensity: 40,
    gpuAccelerated: true,
  },
  {
    id: 'distressed',
    name: 'Distressed',
    description: 'Worn and weathered with random fade patterns',
    category: 'effect',
    cssFilter: 'brightness(1.15) contrast(0.85) saturate(0.75) sepia(0.05)',
    canvasFilter: {
      type: 'custom',
      customShader: 'distressed-shader',
    },
    preview: '/assets/textures/distressed-preview.webp',
    intensity: 65,
    gpuAccelerated: true,
  },
  {
    id: 'tie-dye',
    name: 'Tie Dye Base',
    description: 'Prepared base for tie-dye effects with enhanced color absorption',
    category: 'effect',
    cssFilter: 'saturate(1.3) contrast(1.1) brightness(1.05)',
    canvasFilter: {
      type: 'color-matrix',
      matrix: [
        1.1, 0, 0, 0, 0,
        0, 1.1, 0, 0, 0,
        0, 0, 1.1, 0, 0,
        0, 0, 0, 1, 0
      ],
    },
    preview: '/assets/textures/tie-dye-preview.webp',
    intensity: 55,
    gpuAccelerated: true,
  },
];

// Helper functions for texture filter management
export const getTextureFiltersByCategory = (category: TextureFilter['category']) =>
  TEXTURE_FILTERS.filter(filter => filter.category === category);

export const getTextureFilterById = (id: string) =>
  TEXTURE_FILTERS.find(filter => filter.id === id);

export const getGPUAcceleratedFilters = () =>
  TEXTURE_FILTERS.filter(filter => filter.gpuAccelerated);

export const getTextureFiltersByIntensity = (minIntensity: number, maxIntensity: number) =>
  TEXTURE_FILTERS.filter(filter => 
    filter.intensity >= minIntensity && filter.intensity <= maxIntensity
  );

// Texture filter categories for UI organization
export const TEXTURE_CATEGORIES = [
  { id: 'wash', name: 'Wash Effects', description: 'Faded and worn appearances' },
  { id: 'weave', name: 'Fabric Weave', description: 'Texture and weave patterns' },
  { id: 'finish', name: 'Surface Finish', description: 'Shine and surface treatments' },
  { id: 'effect', name: 'Special Effects', description: 'Unique styling effects' },
] as const;