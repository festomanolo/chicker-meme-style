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

