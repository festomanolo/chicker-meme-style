# Photorealistic T-Shirt Mockup Assets

This directory contains photorealistic t-shirt mockup images and their associated mask files.

## File Structure

```
mockups/
├── regular-front-1x.webp     # Regular t-shirt front view (520x600)
├── regular-front-2x.webp     # Regular t-shirt front view (1040x1200)
├── regular-front-3x.webp     # Regular t-shirt front view (1560x1800)
├── regular-front-mask.png    # Alpha mask for design area
├── regular-back-1x.webp      # Regular t-shirt back view (520x600)
├── regular-back-2x.webp      # Regular t-shirt back view (1040x1200)
├── regular-back-3x.webp      # Regular t-shirt back view (1560x1800)
├── regular-back-mask.png     # Alpha mask for design area
├── longsleeve-front-1x.webp  # Long sleeve front view (520x600)
├── longsleeve-front-2x.webp  # Long sleeve front view (1040x1200)
├── longsleeve-front-3x.webp  # Long sleeve front view (1560x1800)
├── longsleeve-front-mask.png # Alpha mask for design area
├── longsleeve-back-1x.webp   # Long sleeve back view (520x600)
├── longsleeve-back-2x.webp   # Long sleeve back view (1040x1200)
├── longsleeve-back-3x.webp   # Long sleeve back view (1560x1800)
└── longsleeve-back-mask.png  # Alpha mask for design area
```

## Image Requirements

### Mockup Images
- **Format**: WebP for optimal compression and quality
- **Dimensions**: 
  - 1x: 520x600px (base resolution)
  - 2x: 1040x1200px (high DPI displays)
  - 3x: 1560x1800px (ultra-high DPI displays)
- **Quality**: High-quality photorealistic rendering with:
  - Natural fabric folds and wrinkles
  - Realistic shadows and lighting
  - Proper fabric texture representation
  - Professional photography appearance

### Mask Files
- **Format**: PNG with alpha channel
- **Dimensions**: Same as 1x mockup images (520x600px)
- **Purpose**: Define the editable design area on the t-shirt
- **Requirements**:
  - White areas (255,255,255,255) = design area
  - Transparent areas (0,0,0,0) = non-design area
  - Smooth edges with anti-aliasing
  - Follow natural chest curvature for front views
  - Rectangular area for back views

## Design Area Specifications

### Regular T-Shirt
- **Front Design Area**: 200x240px centered on chest
- **Back Design Area**: 200x260px centered on back
- **Curvature**: Follows natural chest contour with subtle curve

### Long Sleeve T-Shirt
- **Front Design Area**: 200x240px centered on chest
- **Back Design Area**: 200x260px centered on back
- **Curvature**: Similar to regular with slightly more pronounced chest curve

## Color Tinting Support

All mockup images should be designed to support color tinting:
- Use neutral base colors (light gray or white)
- Maintain shadow and highlight details
- Preserve fabric texture information
- Allow for CSS filter-based color manipulation

## Performance Considerations

- WebP format provides 25-35% better compression than JPEG
- Progressive loading supported for better user experience
- Lazy loading implemented for non-visible mockups
- Multiple resolution variants for optimal bandwidth usage
