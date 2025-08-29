// Canvas container with panel-aware layout
import React, { useRef, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { useCanvasLayout } from '@/hooks/useCanvasLayout';
import { Button } from '@/components/ui/button';
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize, 
  RotateCcw,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface CanvasContainerProps {
  children: React.ReactNode;
  isPanelOpen: boolean;
  panelWidth?: number;
  panelPosition?: 'left' | 'right';
  onPanelToggle?: () => void;
  className?: string;
  showControls?: boolean;
  maintainAspectRatio?: boolean;
}

export const CanvasContainer: React.FC<CanvasContainerProps> = ({
  children,
  isPanelOpen,
  panelWidth = 320,
  panelPosition = 'right',
  onPanelToggle,
  className,
  showControls = true,
  maintainAspectRatio = true,
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  
  const {
    layoutState,
    setZoom,
    setPan,
    fitToCanvas,
    resetView,
    getCanvasStyles,
  } = useCanvasLayout({
    config: {
