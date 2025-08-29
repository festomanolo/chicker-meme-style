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
