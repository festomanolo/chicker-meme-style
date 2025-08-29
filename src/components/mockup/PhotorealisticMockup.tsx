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
