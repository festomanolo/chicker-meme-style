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
