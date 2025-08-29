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
