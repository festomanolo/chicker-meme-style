// Snap guides component for visual alignment feedback
import React, { useMemo } from 'react';
import { SnapGuide } from '@/types/transform';
import { cn } from '@/lib/utils';

interface SnapGuidesProps {
  guides: SnapGuide[];
  canvasSize: { width: number; height: number };
  zoom: number;
  className?: string;
  showGrid?: boolean;
  gridSize?: number;
  gridOpacity?: number;
}

export const SnapGuides: React.FC<SnapGuidesProps> = ({
  guides,
  canvasSize,
  zoom,
  className,
  showGrid = false,
  gridSize = 20,
  gridOpacity = 0.1,
}) => {
  // Filter and sort guides by priority and visibility
  const visibleGuides = useMemo(() => {
    return guides
      .filter(guide => guide.temporary || guide.type === 'center' || guide.type === 'mockup')
      .sort((a, b) => a.priority - b.priority);
  }, [guides]);

  // Generate grid pattern
  const gridPattern = useMemo(() => {
    if (!showGrid) return null;

    const lines = [];
    const scaledGridSize = gridSize * zoom;

    // Vertical lines
    for (let x = 0; x <= canvasSize.width; x += gridSize) {
      lines.push(
        <line
          key={`v-${x}`}
          x1={x}
          y1={0}
          x2={x}
          y2={canvasSize.height}
