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
