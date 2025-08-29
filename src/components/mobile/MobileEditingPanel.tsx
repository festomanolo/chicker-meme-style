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
