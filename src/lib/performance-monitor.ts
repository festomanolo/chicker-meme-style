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

  /**
   * Check if performance meets requirements
   */
  checkPerformance(): {
    isOptimal: boolean;
    warnings: string[];
    recommendations: string[];
  } {
    const warnings: string[] = [];
    const recommendations: string[] = [];

    // Check render time (should be < 60ms for 60fps)
    if (this.metrics.renderTime > 60) {
      warnings.push(`Render time is ${this.metrics.renderTime.toFixed(2)}ms (target: <60ms)`);
      recommendations.push('Consider optimizing component renders and reducing DOM complexity');
    }

    // Check FPS (should be close to 60)
    if (this.metrics.fps < 50) {
      warnings.push(`FPS is ${this.metrics.fps} (target: 60fps)`);
      recommendations.push('Enable GPU acceleration and optimize animations');
    }

    // Check memory usage (should be reasonable)
    if (this.metrics.memoryUsage > 100) {
      warnings.push(`Memory usage is ${this.metrics.memoryUsage.toFixed(2)}MB`);
      recommendations.push('Check for memory leaks and optimize image loading');
    }

    // Check load time (should be < 3s)
    if (this.metrics.loadTime > 3000) {
      warnings.push(`Load time is ${this.metrics.loadTime}ms (target: <3000ms)`);
      recommendations.push('Optimize bundle size and enable code splitting');
    }

    return {
      isOptimal: warnings.length === 0,
      warnings,
      recommendations,
    };
  }

  /**
   * Log performance metrics
   */
  logMetrics(): void {
    if (process.env.NODE_ENV === 'development') {
      console.group('🚀 Performance Metrics');
      console.log('Render Time:', `${this.metrics.renderTime.toFixed(2)}ms`);
      console.log('FPS:', this.metrics.fps);
      console.log('Memory Usage:', `${this.metrics.memoryUsage.toFixed(2)}MB`);
      console.log('Load Time:', `${this.metrics.loadTime}ms`);
      
      const check = this.checkPerformance();
      if (!check.isOptimal) {
        console.warn('Performance Issues:', check.warnings);
        console.info('Recommendations:', check.recommendations);
      } else {
        console.log('✅ Performance is optimal');
      }
      console.groupEnd();
    }
  }
}

/**
 * React hook for performance monitoring
 */
export const usePerformanceMonitor = () => {
  const monitor = PerformanceMonitor.getInstance();

  React.useEffect(() => {
    monitor.measureLoadTime();
    
    const interval = setInterval(() => {
      monitor.updateFPS();
    }, 16); // ~60fps

    return () => clearInterval(interval);
  }, [monitor]);

  return {
    startRender: monitor.startRender.bind(monitor),
    endRender: monitor.endRender.bind(monitor),
    getMetrics: monitor.getMetrics.bind(monitor),
    checkPerformance: monitor.checkPerformance.bind(monitor),
    logMetrics: monitor.logMetrics.bind(monitor),
  };
};