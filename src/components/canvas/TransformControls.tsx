// Transform controls component with live handles for resize and rotate
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { TransformData, TransformHandle, Point, DragState } from '@/types/transform';
import { cn } from '@/lib/utils';
import { RotateCcw, Move, RotateCw } from 'lucide-react';

interface TransformControlsProps {
  element: any; // DesignElement
  isSelected: boolean;
  onTransform: (transform: TransformData) => void;
  onTransformEnd: () => void;
  canvasRect: DOMRect;
  zoom: number;
  disabled?: boolean;
  showRotationHandle?: boolean;
  showNumericReadout?: boolean;
  snapToGrid?: boolean;
  gridSize?: number;
  className?: string;
}

export const TransformControls: React.FC<TransformControlsProps> = ({
  element,
  isSelected,
  onTransform,
  onTransformEnd,
  canvasRect,
  zoom,
  disabled = false,
  showRotationHandle = true,
  showNumericReadout = true,
  snapToGrid = false,
  gridSize = 10,
  className,
}) => {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    startPosition: { x: 0, y: 0 },
    currentPosition: { x: 0, y: 0 },
    offset: { x: 0, y: 0 },
    elementId: null,
  });
  const [isShiftPressed, setIsShiftPressed] = useState(false);
  const [liveTransform, setLiveTransform] = useState<TransformData | null>(null);

  // Track keyboard state for modifier keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Shift') setIsShiftPressed(true);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Shift') setIsShiftPressed(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Generate transform handles
  const handles = useMemo((): TransformHandle[] => {
    if (!isSelected || disabled) return [];

    const { x, y, width, height } = element;
    const handleSize = 8 / zoom; // Scale handle size with zoom
    const offset = handleSize / 2;

    return [
      // Corner handles
      {
        id: 'nw',
        type: 'corner',
        position: 'nw',
        cursor: 'nw-resize',
        bounds: { x: x - offset, y: y - offset, width: handleSize, height: handleSize },
        active: false,
      },
      {
        id: 'ne',
        type: 'corner',
        position: 'ne',
        cursor: 'ne-resize',
        bounds: { x: x + width - offset, y: y - offset, width: handleSize, height: handleSize },
        active: false,
      },
      {
        id: 'se',
        type: 'corner',
        position: 'se',
        cursor: 'se-resize',
        bounds: { x: x + width - offset, y: y + height - offset, width: handleSize, height: handleSize },
        active: false,
      },
      {
        id: 'sw',
        type: 'corner',
        position: 'sw',
        cursor: 'sw-resize',
        bounds: { x: x - offset, y: y + height - offset, width: handleSize, height: handleSize },
        active: false,
      },
      // Edge handles
      {
        id: 'n',
        type: 'edge',
        position: 'n',
