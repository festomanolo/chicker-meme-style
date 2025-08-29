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
      panelWidth,
      panelPosition,
      maintainAspectRatio,
    },
  });

  // Handle wheel zoom
  const handleWheel = useCallback((e: WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      const newZoom = Math.max(0.1, Math.min(5, layoutState.zoom + delta));
      
      setZoom(newZoom, false);
    }
  }, [layoutState.zoom, setZoom]);

  // Handle pan with mouse drag
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 1 && !e.shiftKey) return;
    
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const startPanX = layoutState.panX;
    const startPanY = layoutState.panY;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      
      setPan(startPanX + deltaX, startPanY + deltaY, false);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [layoutState.panX, layoutState.panY, setPan]);

  // Add event listeners
  useEffect(() => {
