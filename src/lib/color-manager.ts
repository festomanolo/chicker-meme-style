// Color management service for fabric color application and blending
import { TshirtColor } from '@/types/color';
import { TshirtMockup } from '@/types/mockup';
import { TextureFilter, FabricBlendOptions, ColorBlendResult } from '@/types/texture';
import { ColorConverter } from '@/lib/color-utils';

/**
 * ColorManager service for applying colors to fabric with realistic blending
 */
export class ColorManager {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private performanceCache = new Map<string, ColorBlendResult>();

  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d')!;
  }

  /**
   * Apply color to fabric mockup with realistic blending
   */
  async applyColorToFabric(
    color: TshirtColor, 
    mockup: TshirtMockup, 
    textureFilter?: TextureFilter
  ): Promise<string> {
    const startTime = performance.now();
    
    try {
      // Generate cache key
      const cacheKey = this.generateCacheKey(color, mockup, textureFilter);
      
      // Check cache first
      if (this.performanceCache.has(cacheKey)) {
        const cached = this.performanceCache.get(cacheKey)!;
        return cached.blendedColor;
      }

      // Choose optimal blending method based on browser capabilities
      const blendResult = await this.selectOptimalBlendingMethod(color, mockup, textureFilter);
      
      // Cache result
      this.performanceCache.set(cacheKey, {
        ...blendResult,
        performanceMetrics: {
          blendTime: performance.now() - startTime,
          method: blendResult.performanceMetrics.method,
        },
      });

      return blendResult.blendedColor;
    } catch (error) {
      console.error('Failed to apply color to fabric:', error);
      // Fallback to simple CSS filter
      return this.generateSimpleCSSFilter(color);
    }
  }

  /**
