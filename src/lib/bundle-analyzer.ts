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
