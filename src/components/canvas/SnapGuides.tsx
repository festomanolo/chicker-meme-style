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
          stroke="currentColor"
          strokeWidth={1 / zoom}
          opacity={gridOpacity}
        />
      );
    }

    // Horizontal lines
    for (let y = 0; y <= canvasSize.height; y += gridSize) {
      lines.push(
        <line
          key={`h-${y}`}
          x1={0}
          y1={y}
          x2={canvasSize.width}
          y2={y}
          stroke="currentColor"
          strokeWidth={1 / zoom}
          opacity={gridOpacity}
        />
      );
    }

    return lines;
  }, [showGrid, gridSize, canvasSize, zoom, gridOpacity]);

  // Get guide style based on type and state
  const getGuideStyle = (guide: SnapGuide) => {
    const baseStyle = {
      strokeWidth: guide.temporary ? 2 / zoom : 1 / zoom,
      opacity: guide.temporary ? 0.8 : 0.3,
    };

    switch (guide.type) {
      case 'center':
        return {
          ...baseStyle,
          stroke: '#3B82F6', // Blue
          strokeDasharray: guide.temporary ? 'none' : `${4 / zoom} ${4 / zoom}`,
        };
      case 'mockup':
        return {
          ...baseStyle,
          stroke: '#10B981', // Green
          strokeDasharray: guide.temporary ? 'none' : `${6 / zoom} ${2 / zoom}`,
        };
      case 'element':
        return {
          ...baseStyle,
          stroke: '#F59E0B', // Amber
          strokeDasharray: guide.temporary ? 'none' : `${2 / zoom} ${2 / zoom}`,
        };
      case 'grid':
        return {
          ...baseStyle,
          stroke: '#6B7280', // Gray
          strokeDasharray: `${1 / zoom} ${1 / zoom}`,
        };
      default:
        return {
          ...baseStyle,
          stroke: '#8B5CF6', // Purple
        };
    }
  };

  return (
    <div className={cn("absolute inset-0 pointer-events-none", className)}>
      <svg
        width={canvasSize.width}
        height={canvasSize.height}
        className="absolute inset-0 text-gray-400"
        style={{ zIndex: 100 }}
      >
        {/* Grid pattern */}
        {showGrid && (
          <g className="opacity-50">
            {gridPattern}
          </g>
        )}

        {/* Snap guides */}
        <g className="snap-guides">
          {visibleGuides.map((guide, index) => {
            const style = getGuideStyle(guide);
            const key = `${guide.type}-${guide.axis}-${guide.position}-${index}`;

            if (guide.axis === 'x') {
              // Vertical guide line
              return (
                <line
                  key={key}
                  x1={guide.position}
                  y1={0}
                  x2={guide.position}
                  y2={canvasSize.height}
                  {...style}
                  className={cn(
                    "transition-opacity duration-200",
                    guide.temporary && "animate-pulse"
                  )}
                />
              );
            } else {
              // Horizontal guide line
              return (
                <line
                  key={key}
                  x1={0}
                  y1={guide.position}
                  x2={canvasSize.width}
                  y2={guide.position}
                  {...style}
                  className={cn(
                    "transition-opacity duration-200",
                    guide.temporary && "animate-pulse"
                  )}
                />
              );
            }
          })}
        </g>

        {/* Guide labels for temporary guides */}
        {visibleGuides
          .filter(guide => guide.temporary)
          .map((guide, index) => {
            const labelText = `${guide.type} ${Math.round(guide.position)}px`;
            const key = `label-${guide.type}-${guide.axis}-${guide.position}-${index}`;

            return (
              <g key={key}>
                {guide.axis === 'x' ? (
                  // Vertical guide label
                  <g>
                    <rect
                      x={guide.position - 30 / zoom}
                      y={10 / zoom}
                      width={60 / zoom}
                      height={20 / zoom}
                      fill="rgba(0, 0, 0, 0.8)"
                      rx={4 / zoom}
                    />
                    <text
                      x={guide.position}
                      y={20 / zoom}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="white"
                      fontSize={12 / zoom}
                      fontFamily="system-ui, sans-serif"
                    >
                      {labelText}
                    </text>
                  </g>
                ) : (
                  // Horizontal guide label
                  <g>
                    <rect
                      x={10 / zoom}
                      y={guide.position - 10 / zoom}
                      width={60 / zoom}
                      height={20 / zoom}
                      fill="rgba(0, 0, 0, 0.8)"
                      rx={4 / zoom}
                    />
                    <text
                      x={40 / zoom}
                      y={guide.position}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="white"
                      fontSize={12 / zoom}
                      fontFamily="system-ui, sans-serif"
                    >
                      {labelText}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
      </svg>
    </div>
  );
};

export default SnapGuides;