// Bundle size analysis and optimization utilities
export interface BundleAnalysis {
  totalSize: number;
  gzippedSize: number;
  chunks: ChunkInfo[];
  recommendations: string[];
  warnings: string[];
}

export interface ChunkInfo {
  name: string;
  size: number;
  modules: ModuleInfo[];
}

export interface ModuleInfo {
  name: string;
  size: number;
  path: string;
}

export class BundleAnalyzer {
  /**
   * Analyze bundle size and provide recommendations
   */
  static analyzeBundleSize(): BundleAnalysis {
    const recommendations: string[] = [];
    const warnings: string[] = [];

    // Simulate bundle analysis (in real implementation, this would use webpack-bundle-analyzer data)
    const mockAnalysis: BundleAnalysis = {
      totalSize: 2.5 * 1024 * 1024, // 2.5MB
      gzippedSize: 800 * 1024, // 800KB
      chunks: [
        {
          name: 'main',
          size: 1.2 * 1024 * 1024,
          modules: [
            { name: 'react', size: 200 * 1024, path: 'node_modules/react' },
            { name: 'lucide-react', size: 150 * 1024, path: 'node_modules/lucide-react' },
            { name: 'app-code', size: 850 * 1024, path: 'src/' },
          ],
        },
        {
          name: 'vendor',
          size: 1.3 * 1024 * 1024,
          modules: [
            { name: 'react-dom', size: 300 * 1024, path: 'node_modules/react-dom' },
            { name: 'other-deps', size: 1000 * 1024, path: 'node_modules/' },
          ],
        },
      ],
      recommendations: [],
      warnings: [],
    };

    // Analyze and provide recommendations
    if (mockAnalysis.totalSize > 3 * 1024 * 1024) {
      warnings.push('Bundle size exceeds 3MB - consider code splitting');
      recommendations.push('Implement lazy loading for non-critical components');
      recommendations.push('Use dynamic imports for large dependencies');
    }

    if (mockAnalysis.gzippedSize > 1024 * 1024) {
      warnings.push('Gzipped size exceeds 1MB');
      recommendations.push('Enable tree shaking for unused code');
      recommendations.push('Consider using smaller alternative libraries');
    }

    // Check for large modules
    mockAnalysis.chunks.forEach(chunk => {
      chunk.modules.forEach(module => {
        if (module.size > 500 * 1024) {
          warnings.push(`Large module detected: ${module.name} (${(module.size / 1024).toFixed(0)}KB)`);
          recommendations.push(`Consider code splitting for ${module.name}`);
        }
      });
    });

    return {
      ...mockAnalysis,
      recommendations,
      warnings,
    };
  }

  /**
   * Get optimization suggestions
   */
  static getOptimizationSuggestions(): {
    codesplitting: string[];
    treeshaking: string[];
    compression: string[];
    caching: string[];
  } {
    return {
      codesplitting: [
        'Use React.lazy() for route-based code splitting',
        'Implement dynamic imports for heavy components',
        'Split vendor libraries into separate chunks',
        'Use loadable-components for better SSR support',
      ],
      treeshaking: [
        'Import only needed functions from libraries',
        'Use ES6 modules instead of CommonJS',
        'Configure webpack to eliminate dead code',
        'Use babel-plugin-import for selective imports',
      ],
      compression: [
        'Enable gzip compression on server',
        'Use Brotli compression for better ratios',
        'Minify CSS and JavaScript',
        'Optimize images with WebP format',
      ],
      caching: [
        'Implement proper cache headers',
        'Use content-based hashing for assets',
        'Enable service worker for offline caching',
        'Implement CDN for static assets',
      ],
    };
  }

  /**
   * Check if bundle meets performance budgets
   */
  static checkPerformanceBudget(analysis: BundleAnalysis): {
    passes: boolean;
    results: Array<{
      metric: string;
      actual: number;
      budget: number;
      passes: boolean;
    }>;
  } {
    const budgets = {
      totalSize: 3 * 1024 * 1024, // 3MB
      gzippedSize: 1024 * 1024, // 1MB
      mainChunkSize: 1.5 * 1024 * 1024, // 1.5MB
    };

    const results = [
      {
        metric: 'Total Bundle Size',
        actual: analysis.totalSize,
        budget: budgets.totalSize,
        passes: analysis.totalSize <= budgets.totalSize,
      },
      {
        metric: 'Gzipped Size',
        actual: analysis.gzippedSize,
        budget: budgets.gzippedSize,
        passes: analysis.gzippedSize <= budgets.gzippedSize,
      },
      {
        metric: 'Main Chunk Size',
        actual: analysis.chunks.find(c => c.name === 'main')?.size || 0,
        budget: budgets.mainChunkSize,
        passes: (analysis.chunks.find(c => c.name === 'main')?.size || 0) <= budgets.mainChunkSize,
      },
    ];

    return {
      passes: results.every(r => r.passes),
      results,
    };
  }

  /**
   * Format size for display
   */
  static formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  }

  /**
   * Generate bundle report
   */
  static generateReport(): string {
    const analysis = this.analyzeBundleSize();
    const budget = this.checkPerformanceBudget(analysis);
    const suggestions = this.getOptimizationSuggestions();

    let report = '# Bundle Analysis Report\n\n';
    
    report += '## Size Metrics\n';
    report += `- Total Size: ${this.formatSize(analysis.totalSize)}\n`;
    report += `- Gzipped Size: ${this.formatSize(analysis.gzippedSize)}\n`;
    report += `- Compression Ratio: ${((1 - analysis.gzippedSize / analysis.totalSize) * 100).toFixed(1)}%\n\n`;

    report += '## Performance Budget\n';
    budget.results.forEach(result => {
