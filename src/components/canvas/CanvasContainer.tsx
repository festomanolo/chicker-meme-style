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
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      canvas.removeEventListener('wheel', handleWheel);
    };
  }, [handleWheel]);

  const handleZoomIn = () => {
    const newZoom = Math.min(5, layoutState.zoom * 1.2);
    setZoom(newZoom);
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(0.1, layoutState.zoom / 1.2);
    setZoom(newZoom);
  };

  const canvasStyles = getCanvasStyles();

  return (
    <div className={cn('relative w-full h-full overflow-hidden bg-gray-100 dark:bg-gray-800', className)}>
      {/* Canvas area */}
      <div
        ref={canvasRef}
        className="absolute inset-0 cursor-grab active:cursor-grabbing"
        style={{
          left: isPanelOpen && panelPosition === 'left' ? panelWidth : 0,
          right: isPanelOpen && panelPosition === 'right' ? panelWidth : 0,
          transition: layoutState.isAnimating ? 'left 300ms ease-out, right 300ms ease-out' : 'none',
        }}
        onMouseDown={handleMouseDown}
      >
        {/* Canvas content */}
        <div
          className="absolute top-0 left-0 origin-top-left"
          style={canvasStyles}
        >
          {children}
        </div>

        {/* Grid background */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px',
            transform: `translate(${layoutState.panX % 20}px, ${layoutState.panY % 20}px)`,
          }}
        />
      </div>

      {/* Panel collapse button */}
      {onPanelToggle && (
        <Button
          variant="outline"
          size="sm"
          className={cn(
            'absolute top-4 z-10 h-8 w-8 p-0 bg-white dark:bg-gray-800 shadow-md',
            panelPosition === 'right' ? 'right-4' : 'left-4',
            isPanelOpen && panelPosition === 'right' && 'right-[340px]',
            isPanelOpen && panelPosition === 'left' && 'left-[340px]',
            'transition-all duration-300 ease-out'
          )}
          onClick={onPanelToggle}
        >
          {isPanelOpen ? (
            panelPosition === 'right' ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />
          ) : (
            panelPosition === 'right' ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
          )}
        </Button>
      )}

      {/* Canvas controls */}
      {showControls && (
        <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-white dark:bg-gray-800 rounded-lg shadow-md p-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomOut}
            className="h-8 w-8 p-0"
            disabled={layoutState.zoom <= 0.1}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          
          <div className="px-2 text-sm font-mono min-w-[60px] text-center">
