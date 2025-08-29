// Photorealistic mockup asset loading utilities
import { TshirtMockup, MockupAssetInfo, MockupLoadOptions, MockupValidationResult } from '@/types/mockup';

class MockupAssetLoader {
  private cache = new Map<string, MockupAssetInfo>();
  private loadingPromises = new Map<string, Promise<MockupAssetInfo>>();

  /**
   * Load a mockup asset with fallback resolution support
   */
  async loadMockupAsset(
    mockup: TshirtMockup, 
    options: MockupLoadOptions = {}
  ): Promise<MockupAssetInfo> {
    const {
      preferredResolution = this.getOptimalResolution(),
      fallbackResolution = '1x',
      timeout = 10000,
      retryCount = 3
    } = options;

    const cacheKey = `${mockup.id}-${preferredResolution}`;
    
    // Return cached asset if available
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey)!;
      if (cached.loaded && !cached.error) {
        return cached;
      }
    }

    // Return existing loading promise if in progress
    if (this.loadingPromises.has(cacheKey)) {
      return this.loadingPromises.get(cacheKey)!;
    }

    // Start new loading process
    const loadingPromise = this.loadAssetWithFallback(
      mockup, 
      preferredResolution, 
      fallbackResolution, 
      timeout, 
      retryCount
    );

    this.loadingPromises.set(cacheKey, loadingPromise);

    try {
      const result = await loadingPromise;
      this.cache.set(cacheKey, result);
      return result;
    } finally {
      this.loadingPromises.delete(cacheKey);
    }
  }

  /**
   * Load asset with fallback resolution if primary fails
   */
  private async loadAssetWithFallback(
    mockup: TshirtMockup,
    primaryResolution: '1x' | '2x' | '3x',
    fallbackResolution: '1x' | '2x' | '3x',
    timeout: number,
    retryCount: number
  ): Promise<MockupAssetInfo> {
    try {
      return await this.loadSingleAsset(
        mockup.variants[primaryResolution], 
        timeout, 
        retryCount
      );
    } catch (primaryError) {
      console.warn(`Failed to load ${primaryResolution} resolution for ${mockup.id}, trying ${fallbackResolution}`);
      
      try {
        return await this.loadSingleAsset(
          mockup.variants[fallbackResolution], 
          timeout, 
          Math.max(1, retryCount - 1)
        );
      } catch (fallbackError) {
        throw new Error(`Failed to load mockup ${mockup.id}: ${fallbackError}`);
      }
    }
  }

  /**
   * Load a single asset with retry logic
   */
  private async loadSingleAsset(
    url: string, 
    timeout: number, 
    retryCount: number
  ): Promise<MockupAssetInfo> {
    let lastError: Error;

    for (let attempt = 0; attempt < retryCount; attempt++) {
      try {
        const asset = await this.loadImageWithTimeout(url, timeout);
        return {
          url,
          width: asset.naturalWidth,
          height: asset.naturalHeight,
          loaded: true,
        };
      } catch (error) {
        lastError = error as Error;
        if (attempt < retryCount - 1) {
          // Exponential backoff
          await this.delay(Math.pow(2, attempt) * 1000);
        }
      }
    }

    return {
      url,
      width: 0,
      height: 0,
      loaded: false,
      error: lastError!.message,
    };
  }

  /**
   * Load image with timeout
   */
  private loadImageWithTimeout(url: string, timeout: number): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const timeoutId = setTimeout(() => {
        reject(new Error(`Image load timeout: ${url}`));
      }, timeout);

      img.onload = () => {
        clearTimeout(timeoutId);
        resolve(img);
      };

      img.onerror = () => {
        clearTimeout(timeoutId);
        reject(new Error(`Failed to load image: ${url}`));
      };

      img.src = url;
    });
  }

  /**
   * Get optimal resolution based on device pixel ratio
   */
  private getOptimalResolution(): '1x' | '2x' | '3x' {
    const dpr = window.devicePixelRatio || 1;
    if (dpr >= 3) return '3x';
    if (dpr >= 2) return '2x';
    return '1x';
  }

  /**
   * Preload multiple mockups
   */
  async preloadMockups(mockups: TshirtMockup[], options?: MockupLoadOptions): Promise<MockupAssetInfo[]> {
    const loadPromises = mockups.map(mockup => 
      this.loadMockupAsset(mockup, options).catch(error => ({
        url: mockup.variants['1x'],
        width: 0,
        height: 0,
        loaded: false,
        error: error.message,
      }))
    );

    return Promise.all(loadPromises);
  }

  /**
   * Validate mockup data structure
   */
  validateMockup(mockup: TshirtMockup): MockupValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required fields validation
    if (!mockup.id) errors.push('Mockup ID is required');
    if (!mockup.name) errors.push('Mockup name is required');
    if (!['front', 'back'].includes(mockup.type)) {
      errors.push('Mockup type must be "front" or "back"');
    }

    // Variants validation
    if (!mockup.variants) {
      errors.push('Mockup variants are required');
    } else {
      ['1x', '2x', '3x'].forEach(resolution => {
        if (!mockup.variants[resolution as keyof typeof mockup.variants]) {
          errors.push(`Missing ${resolution} resolution variant`);
        }
      });
    }

    // Design area validation
    if (!mockup.designArea) {
      errors.push('Design area is required');
    } else {
      if (mockup.designArea.width <= 0 || mockup.designArea.height <= 0) {
        errors.push('Design area dimensions must be positive');
      }
      if (!mockup.designArea.curvature || !mockup.designArea.curvature.points) {
        warnings.push('Design area curvature not defined, using rectangular area');
      }
    }

    // Metadata validation
    if (!mockup.metadata) {
      warnings.push('Mockup metadata missing, using defaults');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
    this.loadingPromises.clear();
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return {
      cacheSize: this.cache.size,
      loadingCount: this.loadingPromises.size,
      loadedAssets: Array.from(this.cache.values()).filter(asset => asset.loaded).length,
      failedAssets: Array.from(this.cache.values()).filter(asset => asset.error).length,
    };
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export singleton instance
export const mockupLoader = new MockupAssetLoader();

// Export utility functions
export const loadMockup = (mockup: TshirtMockup, options?: MockupLoadOptions) => 
  mockupLoader.loadMockupAsset(mockup, options);

export const preloadMockups = (mockups: TshirtMockup[], options?: MockupLoadOptions) => 
  mockupLoader.preloadMockups(mockups, options);

export const validateMockup = (mockup: TshirtMockup) => 
  mockupLoader.validateMockup(mockup);