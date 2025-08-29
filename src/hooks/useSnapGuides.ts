// Custom hook for managing snap guides and snapping behavior
import { useState, useCallback, useMemo } from 'react';
import { SnapGuide, Point, SnapResult, Rect } from '@/types/transform';

interface UseSnapGuidesOptions {
  snapThreshold?: number;
  showTemporaryGuides?: boolean;
  enableGridSnap?: boolean;
  gridSize?: number;
}

interface UseSnapGuidesReturn {
  snapGuides: SnapGuide[];
  temporaryGuides: SnapGuide[];
  generateGuides: (elements: any[], canvasSize: { width: number; height: number }, mockupBounds?: Rect) => void;
  snapToGuides: (position: Point, excludeElementId?: string) => SnapResult;
  clearTemporaryGuides: () => void;
  showGrid: boolean;
  setShowGrid: (show: boolean) => void;
}

export const useSnapGuides = (options: UseSnapGuidesOptions = {}): UseSnapGuidesReturn => {
  const {
    snapThreshold = 10,
    showTemporaryGuides = true,
    enableGridSnap = false,
    gridSize = 20,
  } = options;

  const [snapGuides, setSnapGuides] = useState<SnapGuide[]>([]);
  const [temporaryGuides, setTemporaryGuides] = useState<SnapGuide[]>([]);
  const [showGrid, setShowGrid] = useState(false);

  // Generate snap guides for canvas, mockup, and elements
  const generateGuides = useCallback((
    elements: any[],
    canvasSize: { width: number; height: number },
    mockupBounds?: Rect
  ) => {
    const guides: SnapGuide[] = [];

    // Canvas center guides (always visible)
    guides.push(
      {
        type: 'center',
        position: canvasSize.width / 2,
        axis: 'x',
        temporary: false,
        priority: 1,
      },
      {
        type: 'center',
        position: canvasSize.height / 2,
        axis: 'y',
        temporary: false,
        priority: 1,
      }
    );

    // Mockup centerline guides
    if (mockupBounds) {
      guides.push(
        {
          type: 'mockup',
          position: mockupBounds.x + mockupBounds.width / 2,
          axis: 'x',
          temporary: false,
          priority: 2,
        },
        {
          type: 'mockup',
          position: mockupBounds.y + mockupBounds.height / 2,
          axis: 'y',
          temporary: false,
          priority: 2,
        },
        // Mockup edges
        {
          type: 'mockup',
          position: mockupBounds.x,
          axis: 'x',
          temporary: false,
          priority: 3,
        },
        {
          type: 'mockup',
          position: mockupBounds.x + mockupBounds.width,
          axis: 'x',
          temporary: false,
          priority: 3,
        },
        {
          type: 'mockup',
          position: mockupBounds.y,
          axis: 'y',
          temporary: false,
          priority: 3,
        },
        {
          type: 'mockup',
          position: mockupBounds.y + mockupBounds.height,
          axis: 'y',
          temporary: false,
          priority: 3,
        }
      );
    }

    // Element guides
    elements.forEach(element => {
      if (element.visible && !element.locked) {
        const { x, y, width, height } = element;
        
        // Element center guides
        guides.push(
          {
            type: 'element',
            position: x + width / 2,
            axis: 'x',
            temporary: false,
            elementId: element.id,
            priority: 2,
          },
          {
            type: 'element',
            position: y + height / 2,
            axis: 'y',
            temporary: false,
            elementId: element.id,
            priority: 2,
          }
        );

        // Element edge guides
        guides.push(
          {
            type: 'element',
            position: x,
            axis: 'x',
            temporary: false,
            elementId: element.id,
            priority: 3,
          },
          {
            type: 'element',
            position: x + width,
            axis: 'x',
            temporary: false,
            elementId: element.id,
            priority: 3,
          },
          {
            type: 'element',
            position: y,
            axis: 'y',
            temporary: false,
            elementId: element.id,
            priority: 3,
          },
          {
            type: 'element',
            position: y + height,
            axis: 'y',
            temporary: false,
            elementId: element.id,
            priority: 3,
          }
        );
      }
    });

    // Grid guides (if enabled)
    if (enableGridSnap && gridSize > 0) {
      // Generate grid guides at regular intervals
      for (let x = 0; x <= canvasSize.width; x += gridSize) {
        guides.push({
          type: 'grid',
          position: x,
          axis: 'x',
          temporary: false,
          priority: 4,
        });
      }
      
      for (let y = 0; y <= canvasSize.height; y += gridSize) {
        guides.push({
          type: 'grid',
          position: y,
          axis: 'y',
          temporary: false,
          priority: 4,
        });
      }
    }

    // Sort guides by priority
    guides.sort((a, b) => a.priority - b.priority);

    setSnapGuides(guides);
  }, [enableGridSnap, gridSize]);

  // Snap position to nearest guides
  const snapToGuides = useCallback((
    position: Point,
    excludeElementId?: string
  ): SnapResult => {
    const activeGuides: SnapGuide[] = [];
    let snappedPosition = { ...position };
    let minDistanceX = snapThreshold;
    let minDistanceY = snapThreshold;
    let snappedX = false;
    let snappedY = false;

    // Filter out guides from the element being moved
    const relevantGuides = snapGuides.filter(
      guide => !excludeElementId || guide.elementId !== excludeElementId
    );

    // Check X-axis guides
    for (const guide of relevantGuides.filter(g => g.axis === 'x')) {
      const distance = Math.abs(position.x - guide.position);
      if (distance < minDistanceX) {
        snappedPosition.x = guide.position;
        minDistanceX = distance;
        snappedX = true;
        
        // Add to active guides for visual feedback
        if (showTemporaryGuides) {
          activeGuides.push({ ...guide, temporary: true });
        }
      }
    }

    // Check Y-axis guides
    for (const guide of relevantGuides.filter(g => g.axis === 'y')) {
      const distance = Math.abs(position.y - guide.position);
      if (distance < minDistanceY) {
        snappedPosition.y = guide.position;
        minDistanceY = distance;
        snappedY = true;
        
        // Add to active guides for visual feedback
        if (showTemporaryGuides) {
          activeGuides.push({ ...guide, temporary: true });
        }
      }
    }

    // Update temporary guides for visual feedback
    if (showTemporaryGuides) {
      setTemporaryGuides(activeGuides);
    }

    return {
      snapped: snappedX || snappedY,
      position: snappedPosition,
      guides: activeGuides,
      snapDistance: Math.min(minDistanceX, minDistanceY),
    };
  }, [snapGuides, snapThreshold, showTemporaryGuides]);

  // Clear temporary guides
  const clearTemporaryGuides = useCallback(() => {
    setTemporaryGuides([]);
  }, []);

  // Combined guides for rendering
  const allGuides = useMemo(() => {
    return [...snapGuides, ...temporaryGuides];
  }, [snapGuides, temporaryGuides]);

  return {
    snapGuides: allGuides,
    temporaryGuides,
    generateGuides,
    snapToGuides,
    clearTemporaryGuides,
    showGrid,
    setShowGrid,
  };
};

export default useSnapGuides;