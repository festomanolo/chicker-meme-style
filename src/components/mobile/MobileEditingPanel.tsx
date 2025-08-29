// Mobile-optimized editing panel with slide-over behavior
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface MobileEditingPanelProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  className?: string;
  enableSwipeGestures?: boolean;
  showCollapseButton?: boolean;
  position?: 'left' | 'right';
}

interface PanelDimensions {
  width: number;
  height: number;
  isSmallPhone: boolean;
  isTablet: boolean;
}

export const MobileEditingPanel: React.FC<MobileEditingPanelProps> = ({
  isOpen,
  onClose,
  children,
  title = 'Edit',
  className,
  enableSwipeGestures = true,
  showCollapseButton = true,
  position = 'right',
}) => {
  const [dimensions, setDimensions] = useState<PanelDimensions>({
    width: 0,
    height: 0,
    isSmallPhone: false,
    isTablet: false,
  });
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);

  const panelRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Calculate panel dimensions based on viewport
  const calculateDimensions = useCallback(() => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    const isSmallPhone = viewportWidth < 375;
    const isTablet = viewportWidth >= 768;
    
    let panelWidth: number;
    
    if (isSmallPhone) {
      // Small phones: 75% width, full height
      panelWidth = Math.floor(viewportWidth * 0.75);
    } else if (isTablet) {
      // Tablets: 42% width with constraints
      panelWidth = Math.max(260, Math.min(420, Math.floor(viewportWidth * 0.42)));
    } else {
      // Regular phones: 42% width with constraints
      panelWidth = Math.max(260, Math.min(420, Math.floor(viewportWidth * 0.42)));
    }

    setDimensions({
      width: panelWidth,
      height: viewportHeight,
      isSmallPhone,
      isTablet,
    });
  }, []);

  // Update dimensions on resize
  useEffect(() => {
    calculateDimensions();
    
    const handleResize = () => {
      calculateDimensions();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [calculateDimensions]);

  // Handle swipe gestures
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!enableSwipeGestures) return;
    
    const touch = e.touches[0];
    setIsDragging(true);
    setDragStartX(touch.clientX);
    setDragOffset(0);
  }, [enableSwipeGestures]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging || !enableSwipeGestures) return;
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - dragStartX;
    
    // Only allow dragging in the close direction
    const closeDirection = position === 'right' ? 1 : -1;
    const offset = Math.max(0, deltaX * closeDirection);
    
    setDragOffset(offset);
  }, [isDragging, dragStartX, enableSwipeGestures, position]);

  const handleTouchEnd = useCallback(() => {
    if (!isDragging || !enableSwipeGestures) return;
    
    setIsDragging(false);
    
    // Close panel if dragged more than 30% of its width
    if (dragOffset > dimensions.width * 0.3) {
      onClose();
    }
    
    setDragOffset(0);
  }, [isDragging, dragOffset, dimensions.width, onClose, enableSwipeGestures]);

  // Handle backdrop click
  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  }, [onClose]);

  // Panel transform styles
  const panelTransform = () => {
    const baseTransform = position === 'right' 
      ? `translateX(${isOpen ? 0 : 100}%)`
      : `translateX(${isOpen ? 0 : -100}%)`;
    
    if (isDragging && dragOffset > 0) {
      const dragTransform = position === 'right' 
        ? `translateX(${dragOffset}px)`
        : `translateX(-${dragOffset}px)`;
      return dragTransform;
    }
    
    return baseTransform;
  };

  // Backdrop opacity based on drag
  const backdropOpacity = () => {
    if (!isOpen) return 0;
    if (isDragging && dragOffset > 0) {
      return Math.max(0, 0.5 - (dragOffset / dimensions.width) * 0.5);
    }
    return 0.5;
  };

  // Panel width calculation
  const panelWidth = isCollapsed ? 60 : dimensions.width;

  return (
    <>
      {/* Backdrop overlay */}
      <div
        ref={overlayRef}
        className={cn(
          "fixed inset-0 z-40 transition-opacity duration-300",
          isOpen ? "pointer-events-auto" : "pointer-events-none"
        )}
        style={{
          backgroundColor: `rgba(0, 0, 0, ${backdropOpacity()})`,
        }}
        onClick={handleBackdropClick}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className={cn(
          "fixed top-0 z-50 h-full bg-white dark:bg-gray-900 shadow-xl",
          "transition-transform duration-300 ease-out",
          "flex flex-col",
          position === 'right' ? 'right-0' : 'left-0',
          className
        )}
        style={{
          width: panelWidth,
          transform: panelTransform(),
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Panel header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="flex items-center gap-3">
            {showCollapseButton && !dimensions.isSmallPhone && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="h-8 w-8 p-0"
              >
                {isCollapsed ? (
                  position === 'right' ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
                ) : (
                  position === 'right' ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />
                )}
              </Button>
            )}
            
            {!isCollapsed && (
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {title}
              </h2>
            )}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Panel content */}
        <div className="flex-1 overflow-hidden">
          {!isCollapsed && (
            <div className="h-full overflow-y-auto">
              {children}
            </div>
          )}
          
          {isCollapsed && (
            <div className="p-2 space-y-2">
              {/* Collapsed state - show minimal icons */}
              <div className="text-center text-xs text-gray-500">
                Tools
              </div>
            </div>
          )}
        </div>

        {/* Drag indicator */}
        {enableSwipeGestures && (
          <div className={cn(
            "absolute top-1/2 -translate-y-1/2 w-1 h-12 bg-gray-300 dark:bg-gray-600 rounded-full",
            position === 'right' ? '-left-2' : '-right-2'
