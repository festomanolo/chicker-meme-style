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

    return {
      blendedColor: cssFilter,
      cssFilter,
      performanceMetrics: {
        blendTime: 0,
        method: 'css',
      },
    };
  }

  /**
   * Generate CSS filter string for color application
   */
  private generateCSSFilter(color: TshirtColor, textureFilter?: TextureFilter): string {
    const filters: string[] = [];

    // Convert color to HSL for better CSS filter control
    const hsl = ColorConverter.rgbToHsl(color.r, color.g, color.b);

    // Apply hue rotation
    if (hsl.h !== 0) {
      filters.push(`hue-rotate(${hsl.h}deg)`);
    }

    // Apply saturation
    if (hsl.s !== 100) {
      filters.push(`saturate(${hsl.s}%)`);
    }

    // Apply brightness
    if (hsl.l !== 50) {
      const brightness = (hsl.l / 50) * 100;
      filters.push(`brightness(${brightness}%)`);
    }

    // Apply texture filter if provided
    if (textureFilter) {
      filters.push(textureFilter.cssFilter);
    }

    return filters.length > 0 ? filters.join(' ') : 'none';
  }

  /**
   * Generate simple CSS filter for fallback
   */
  private generateSimpleCSSFilter(color: TshirtColor): string {
    const hsl = ColorConverter.rgbToHsl(color.r, color.g, color.b);
    return `hue-rotate(${hsl.h}deg) saturate(${hsl.s}%) brightness(${(hsl.l / 50) * 100}%)`;
  }

  /**
   * Apply texture filter using Canvas API
   */
  private async applyCanvasTextureFilter(textureFilter: TextureFilter): Promise<void> {
    if (!textureFilter.canvasFilter) return;

    const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    const data = imageData.data;

    switch (textureFilter.canvasFilter.type) {
      case 'convolution':
        this.applyConvolutionFilter(data, textureFilter.canvasFilter.kernel!);
        break;
      case 'color-matrix':
        this.applyColorMatrixFilter(data, textureFilter.canvasFilter.matrix!);
        break;
      default:
        break;
    }

    this.ctx.putImageData(imageData, 0, 0);
  }

  /**
   * Apply convolution filter (for texture effects)
   */
  private applyConvolutionFilter(data: Uint8ClampedArray, kernel: number[]): void {
    // Simplified convolution implementation
    // In a real implementation, you would apply the full convolution matrix
    const intensity = kernel.reduce((sum, val) => sum + Math.abs(val), 0);
    
    for (let i = 0; i < data.length; i += 4) {
      const factor = intensity * 0.1;
      data[i] = Math.min(255, data[i] * (1 + factor));     // Red
      data[i + 1] = Math.min(255, data[i + 1] * (1 + factor)); // Green
      data[i + 2] = Math.min(255, data[i + 2] * (1 + factor)); // Blue
    }
  }

  /**
   * Apply color matrix filter
   */
  private applyColorMatrixFilter(data: Uint8ClampedArray, matrix: number[]): void {
    if (matrix.length !== 20) return; // 4x5 matrix expected

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];

      data[i] = Math.min(255, Math.max(0, 
        r * matrix[0] + g * matrix[1] + b * matrix[2] + a * matrix[3] + matrix[4]
      ));
      data[i + 1] = Math.min(255, Math.max(0,
        r * matrix[5] + g * matrix[6] + b * matrix[7] + a * matrix[8] + matrix[9]
      ));
      data[i + 2] = Math.min(255, Math.max(0,
        r * matrix[10] + g * matrix[11] + b * matrix[12] + a * matrix[13] + matrix[14]
      ));
      data[i + 3] = Math.min(255, Math.max(0,
        r * matrix[15] + g * matrix[16] + b * matrix[17] + a * matrix[18] + matrix[19]
      ));
    }
  }

  /**
   * Blend color with fabric using specified options
   */
  blendColorWithFabric(color: TshirtColor, fabricBase: string, options: FabricBlendOptions): string {
    // This would implement sophisticated fabric blending
    // For now, return a CSS filter representation
    return this.generateCSSFilter(color);
  }

  /**
   * Generate color preview with texture applied
   */
  generateColorPreview(color: TshirtColor, texture?: TextureFilter): string {
    const baseFilter = this.generateCSSFilter(color, texture);
    
    // Create a small preview canvas
    const previewCanvas = document.createElement('canvas');
    previewCanvas.width = 100;
    previewCanvas.height = 100;
    const previewCtx = previewCanvas.getContext('2d')!;

    // Fill with base color
    previewCtx.fillStyle = color.hex;
    previewCtx.fillRect(0, 0, 100, 100);

    // Apply texture pattern if available
    if (texture) {
      this.applyTexturePattern(previewCtx, texture);
    }

    return previewCanvas.toDataURL();
  }

  /**
   * Apply texture pattern to preview
   */
  private applyTexturePattern(ctx: CanvasRenderingContext2D, texture: TextureFilter): void {
    // Create texture pattern based on texture type
    switch (texture.category) {
      case 'weave':
        this.drawWeavePattern(ctx);
        break;
      case 'wash':
        this.drawWashPattern(ctx);
        break;
      case 'finish':
        this.drawFinishPattern(ctx);
        break;
      default:
        break;
    }
  }

  /**
   * Draw weave texture pattern
   */
  private drawWeavePattern(ctx: CanvasRenderingContext2D): void {
    ctx.globalCompositeOperation = 'multiply';
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.lineWidth = 0.5;

    // Draw crosshatch pattern
    for (let i = 0; i < 100; i += 2) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 100);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(100, i);
      ctx.stroke();
    }

    ctx.globalCompositeOperation = 'source-over';
  }

  /**
   * Draw wash texture pattern
   */
  private drawWashPattern(ctx: CanvasRenderingContext2D): void {
    ctx.globalCompositeOperation = 'overlay';
    
    // Create random wash effect
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const radius = Math.random() * 10 + 5;
      
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0.05)');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalCompositeOperation = 'source-over';
  }

  /**
   * Draw finish texture pattern
   */
  private drawFinishPattern(ctx: CanvasRenderingContext2D): void {
    ctx.globalCompositeOperation = 'soft-light';
    
    // Create subtle finish effect
    const gradient = ctx.createLinearGradient(0, 0, 100, 100);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.05)');
    gradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.02)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0.05)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 100, 100);

    ctx.globalCompositeOperation = 'source-over';
  }

  /**
   * Utility methods
   */
  private generateCacheKey(color: TshirtColor, mockup: TshirtMockup, textureFilter?: TextureFilter): string {
