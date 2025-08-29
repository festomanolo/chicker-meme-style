// Performance monitoring utilities
export interface PerformanceMetrics {
  renderTime: number;
  memoryUsage: number;
  fps: number;
  bundleSize: number;
  loadTime: number;
}

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: PerformanceMetrics = {
    renderTime: 0,
    memoryUsage: 0,
    fps: 0,
    bundleSize: 0,
    loadTime: 0,
  };
  private fpsCounter = 0;
  private lastFpsTime = 0;
  private renderStartTime = 0;

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  /**
   * Start measuring render time
   */
  startRender(): void {
    this.renderStartTime = performance.now();
  }

  /**
   * End measuring render time
   */
  endRender(): void {
    if (this.renderStartTime > 0) {
      this.metrics.renderTime = performance.now() - this.renderStartTime;
      this.renderStartTime = 0;
    }
  }

  /**
   * Update FPS counter
   */
  updateFPS(): void {
    const now = performance.now();
    this.fpsCounter++;

    if (now - this.lastFpsTime >= 1000) {
      this.metrics.fps = this.fpsCounter;
      this.fpsCounter = 0;
      this.lastFpsTime = now;
    }
  }

  /**
   * Get memory usage
   */
  updateMemoryUsage(): void {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      this.metrics.memoryUsage = memory.usedJSHeapSize / 1024 / 1024; // MB
    }
  }

  /**
   * Measure load time
   */
  measureLoadTime(): void {
    if (performance.timing) {
      const { navigationStart, loadEventEnd } = performance.timing;
      this.metrics.loadTime = loadEventEnd - navigationStart;
    }
  }

  /**
   * Get current metrics
   */
  getMetrics(): PerformanceMetrics {
    this.updateMemoryUsage();
    return { ...this.metrics };
  }

