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
        cursor: 'n-resize',
        bounds: { x: x + width/2 - offset, y: y - offset, width: handleSize, height: handleSize },
        active: false,
      },
      {
        id: 'e',
        type: 'edge',
        position: 'e',
        cursor: 'e-resize',
        bounds: { x: x + width - offset, y: y + height/2 - offset, width: handleSize, height: handleSize },
        active: false,
      },
      {
        id: 's',
        type: 'edge',
        position: 's',
        cursor: 's-resize',
        bounds: { x: x + width/2 - offset, y: y + height - offset, width: handleSize, height: handleSize },
        active: false,
      },
      {
        id: 'w',
        type: 'edge',
        position: 'w',
        cursor: 'w-resize',
        bounds: { x: x - offset, y: y + height/2 - offset, width: handleSize, height: handleSize },
        active: false,
      },
    ];
  }, [element, isSelected, disabled, zoom]);

  // Generate rotation handle
  const rotationHandle = useMemo((): TransformHandle | null => {
    if (!isSelected || disabled || !showRotationHandle) return null;

    const { x, y, width, height } = element;
    const handleSize = 8 / zoom;
    const offset = handleSize / 2;
    const rotationDistance = 30 / zoom; // Distance above the element

    return {
      id: 'rotate',
      type: 'rotation',
      position: 'rotate',
      cursor: 'grab',
      bounds: { 
        x: x + width/2 - offset, 
        y: y - rotationDistance - offset, 
        width: handleSize, 
        height: handleSize 
      },
      active: false,
    };
  }, [element, isSelected, disabled, showRotationHandle, zoom]);

  // Handle mouse down on transform handles
  const handleMouseDown = useCallback((e: React.MouseEvent, handle: TransformHandle) => {
    if (disabled) return;

    e.preventDefault();
    e.stopPropagation();

    const rect = canvasRect;
    const startPosition = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    setDragState({
      isDragging: true,
      startPosition,
      currentPosition: startPosition,
      offset: { x: 0, y: 0 },
      elementId: element.id,
      handleType: handle.type,
      handlePosition: handle.position,
    });

    setLiveTransform({
      x: element.x,
      y: element.y,
      width: element.width,
      height: element.height,
      rotation: element.rotation || 0,
      scaleX: element.scaleX || 1,
      scaleY: element.scaleY || 1,
    });
  }, [disabled, canvasRect, element]);

  // Handle touch start for mobile
  const handleTouchStart = useCallback((e: React.TouchEvent, handle: TransformHandle) => {
    if (disabled) return;

    e.preventDefault();
    e.stopPropagation();

    const touch = e.touches[0];
    const rect = canvasRect;
    const startPosition = {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
    };

    setDragState({
      isDragging: true,
      startPosition,
      currentPosition: startPosition,
      offset: { x: 0, y: 0 },
      elementId: element.id,
      handleType: handle.type,
      handlePosition: handle.position,
