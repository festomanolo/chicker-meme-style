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
   * Select optimal blending method based on performance and browser support
   */
  private async selectOptimalBlendingMethod(
    color: TshirtColor,
    mockup: TshirtMockup,
    textureFilter?: TextureFilter
  ): Promise<ColorBlendResult> {
    // Check for WebGL support for GPU acceleration
    if (this.supportsWebGL() && textureFilter?.gpuAccelerated) {
      try {
        return await this.applyWebGLBlending(color, mockup, textureFilter);
      } catch (error) {
        console.warn('WebGL blending failed, falling back to Canvas API');
      }
    }

    // Try Canvas API blending
    if (this.supportsCanvas2D()) {
      try {
        return await this.applyCanvasBlending(color, mockup, textureFilter);
      } catch (error) {
        console.warn('Canvas blending failed, falling back to CSS filters');
      }
    }

    // Fallback to CSS filters
    return this.applyCSSBlending(color, textureFilter);
  }

  /**
   * Apply color using WebGL for maximum performance
   */
  private async applyWebGLBlending(
    color: TshirtColor,
    mockup: TshirtMockup,
    textureFilter?: TextureFilter
  ): Promise<ColorBlendResult> {
    // This is a simplified WebGL implementation
    // In a real implementation, you would use WebGL shaders for fabric blending
    
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) {
      throw new Error('WebGL not supported');
    }

    // Create shader program for fabric color blending
    const vertexShader = this.createVertexShader(gl);
    const fragmentShader = this.createFabricFragmentShader(gl, color, textureFilter);
    const program = this.createShaderProgram(gl, vertexShader, fragmentShader);

    // Apply the shader and render
    // ... WebGL rendering code would go here ...

    return {
      blendedColor: this.generateCSSFilter(color, textureFilter),
      cssFilter: this.generateCSSFilter(color, textureFilter),
      performanceMetrics: {
        blendTime: 0,
        method: 'webgl',
      },
    };
  }

  /**
   * Apply color using Canvas 2D API
   */
  private async applyCanvasBlending(
    color: TshirtColor,
    mockup: TshirtMockup,
    textureFilter?: TextureFilter
  ): Promise<ColorBlendResult> {
    // Set canvas size
    this.canvas.width = mockup.metadata.originalWidth;
    this.canvas.height = mockup.metadata.originalHeight;

    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Load base mockup image
    const baseImage = await this.loadImage(mockup.variants['1x']);
    
    // Draw base image
    this.ctx.drawImage(baseImage, 0, 0);

    // Apply color overlay with blend mode
    this.ctx.globalCompositeOperation = 'multiply';
    this.ctx.fillStyle = color.hex;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Apply texture filter if provided
    if (textureFilter) {
      await this.applyCanvasTextureFilter(textureFilter);
    }

    // Restore normal blend mode
    this.ctx.globalCompositeOperation = 'source-over';

    // Convert to data URL
    const blendedDataUrl = this.canvas.toDataURL('image/webp', 0.9);

    return {
      blendedColor: blendedDataUrl,
      cssFilter: this.generateCSSFilter(color, textureFilter),
      performanceMetrics: {
        blendTime: 0,
        method: 'canvas',
      },
    };
  }

  /**
   * Apply color using CSS filters (fastest, but less realistic)
   */
  private applyCSSBlending(
    color: TshirtColor,
    textureFilter?: TextureFilter
  ): ColorBlendResult {
    const cssFilter = this.generateCSSFilter(color, textureFilter);

