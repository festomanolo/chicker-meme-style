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
