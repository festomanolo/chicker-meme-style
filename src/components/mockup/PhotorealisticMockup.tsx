// Photorealistic T-shirt mockup component
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { TshirtMockup, MockupAssetInfo } from '@/types/mockup';
import { loadMockup } from '@/lib/mockup-loader';
import { cn } from '@/lib/utils';
import { Loader2, AlertTriangle } from 'lucide-react';

interface PhotorealisticMockupProps {
  mockup: TshirtMockup;
  className?: string;
  onLoad?: (assetInfo: MockupAssetInfo) => void;
  onError?: (error: string) => void;
  fallbackComponent?: React.ReactNode;
  loadingComponent?: React.ReactNode;
  style?: React.CSSProperties;
}

export const PhotorealisticMockup: React.FC<PhotorealisticMockupProps> = ({
  mockup,
  className,
  onLoad,
  onError,
  fallbackComponent,
  loadingComponent,
  style,
}) => {
  const [assetInfo, setAssetInfo] = useState<MockupAssetInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // Load mockup asset
  useEffect(() => {
    let isMounted = true;

    const loadAsset = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const asset = await loadMockup(mockup, {
          preferredResolution: getOptimalResolution(),
          timeout: 15000,
          retryCount: 3,
        });

        if (!isMounted) return;

        if (asset.error) {
          throw new Error(asset.error);
        }

        setAssetInfo(asset);
        onLoad?.(asset);
      } catch (err) {
        if (!isMounted) return;
        
        const errorMessage = err instanceof Error ? err.message : 'Failed to load mockup';
        setError(errorMessage);
        onError?.(errorMessage);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadAsset();

    return () => {
      isMounted = false;
    };
  }, [mockup, onLoad, onError]);

  // Handle image load events
  const handleImageLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleImageError = useCallback(() => {
    const errorMessage = `Failed to display mockup image: ${mockup.name}`;
    setError(errorMessage);
    setIsLoading(false);
    onError?.(errorMessage);
  }, [mockup.name, onError]);

  // Get optimal resolution based on device pixel ratio
  const getOptimalResolution = (): '1x' | '2x' | '3x' => {
    const dpr = window.devicePixelRatio || 1;
    if (dpr >= 3) return '3x';
    if (dpr >= 2) return '2x';
    return '1x';
  };

  // Render loading state
  if (isLoading) {
    if (loadingComponent) {
      return <>{loadingComponent}</>;
    }

    return (
      <div 
        className={cn(
          "flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg",
          "min-h-[400px] w-full",
          className
        )}
        style={style}
      >
        <div className="flex flex-col items-center gap-3 text-gray-500 dark:text-gray-400">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-sm font-medium">Loading {mockup.name}...</p>
        </div>
      </div>
    );
  }

  // Render error state
  if (error || !assetInfo) {
    if (fallbackComponent) {
      return <>{fallbackComponent}</>;
    }

    return (
      <div 
        className={cn(
          "flex items-center justify-center bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800",
          "min-h-[400px] w-full",
          className
        )}
        style={style}
      >
        <div className="flex flex-col items-center gap-3 text-red-600 dark:text-red-400">
          <AlertTriangle className="h-8 w-8" />
          <div className="text-center">
            <p className="text-sm font-medium">Failed to load mockup</p>
            <p className="text-xs text-red-500 dark:text-red-300 mt-1">
              {error || 'Unknown error occurred'}
            </p>
          </div>
