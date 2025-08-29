// Hook for managing canvas layout with panel interactions
import { useState, useEffect, useCallback, useRef } from 'react';

interface CanvasLayoutConfig {
  panelWidth: number;
  panelPosition: 'left' | 'right';
  maintainAspectRatio: boolean;
  animationDuration: number;
  minCanvasWidth: number;
  minCanvasHeight: number;
}

interface CanvasLayoutState {
  canvasWidth: number;
  canvasHeight: number;
  canvasX: number;
  canvasY: number;
  zoom: number;
  panX: number;
  panY: number;
  isAnimating: boolean;
}

interface UseCanvasLayoutOptions {
  config?: Partial<CanvasLayoutConfig>;
  onLayoutChange?: (state: CanvasLayoutState) => void;
}

export const useCanvasLayout = (options: UseCanvasLayoutOptions = {}) => {
  const { config = {}, onLayoutChange } = options;
  
  const defaultConfig: CanvasLayoutConfig = {
    panelWidth: 320,
    panelPosition: 'right',
    maintainAspectRatio: true,
    animationDuration: 300,
    minCanvasWidth: 300,
    minCanvasHeight: 200,
    ...config,
  };

  const [layoutState, setLayoutState] = useState<CanvasLayoutState>({
    canvasWidth: 0,
    canvasHeight: 0,
    canvasX: 0,
    canvasY: 0,
    zoom: 1,
    panX: 0,
    panY: 0,
    isAnimating: false,
  });

  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [viewportDimensions, setViewportDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const animationRef = useRef<number>();
  const previousStateRef = useRef<CanvasLayoutState>(layoutState);

  // Calculate canvas dimensions based on viewport and panel state
  const calculateCanvasDimensions = useCallback(() => {
    const { width: viewportWidth, height: viewportHeight } = viewportDimensions;
    const { panelWidth, panelPosition, minCanvasWidth, minCanvasHeight } = defaultConfig;

    let availableWidth = viewportWidth;
    let canvasX = 0;

    if (isPanelOpen) {
      availableWidth -= panelWidth;
      if (panelPosition === 'left') {
        canvasX = panelWidth;
      }
    }

    const canvasWidth = Math.max(minCanvasWidth, availableWidth);
    const canvasHeight = Math.max(minCanvasHeight, viewportHeight);

    return {
      canvasWidth,
      canvasHeight,
      canvasX,
      canvasY: 0,
    };
  }, [viewportDimensions, isPanelOpen, defaultConfig]);

  // Animate layout changes
  const animateLayoutChange = useCallback((
    fromState: CanvasLayoutState,
    toState: Partial<CanvasLayoutState>
  ) => {
    const startTime = Date.now();
    const { animationDuration } = defaultConfig;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / animationDuration, 1);
      
      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);

      const interpolatedState: CanvasLayoutState = {
        canvasWidth: fromState.canvasWidth + (toState.canvasWidth! - fromState.canvasWidth) * easeOut,
        canvasHeight: fromState.canvasHeight + (toState.canvasHeight! - fromState.canvasHeight) * easeOut,
        canvasX: fromState.canvasX + (toState.canvasX! - fromState.canvasX) * easeOut,
        canvasY: fromState.canvasY + (toState.canvasY! - fromState.canvasY) * easeOut,
        zoom: fromState.zoom + ((toState.zoom || fromState.zoom) - fromState.zoom) * easeOut,
        panX: fromState.panX + ((toState.panX || fromState.panX) - fromState.panX) * easeOut,
        panY: fromState.panY + ((toState.panY || fromState.panY) - fromState.panY) * easeOut,
        isAnimating: progress < 1,
      };

      setLayoutState(interpolatedState);
      onLayoutChange?.(interpolatedState);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        // Animation complete
        const finalState = { ...interpolatedState, isAnimating: false };
        setLayoutState(finalState);
        onLayoutChange?.(finalState);
      }
    };

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    setLayoutState(prev => ({ ...prev, isAnimating: true }));
    animationRef.current = requestAnimationFrame(animate);
  }, [defaultConfig, onLayoutChange]);

  // Update canvas layout when panel state changes
  const updateCanvasLayout = useCallback((animated = true) => {
    const newDimensions = calculateCanvasDimensions();
    const currentState = layoutState;

    if (animated) {
      animateLayoutChange(currentState, newDimensions);
    } else {
      const newState = { ...currentState, ...newDimensions, isAnimating: false };
      setLayoutState(newState);
      onLayoutChange?.(newState);
    }
  }, [calculateCanvasDimensions, layoutState, animateLayoutChange, onLayoutChange]);

  // Handle viewport resize
  useEffect(() => {
    const handleResize = () => {
      setViewportDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update layout when viewport or panel state changes
  useEffect(() => {
    updateCanvasLayout();
  }, [viewportDimensions, isPanelOpen]);

  // Cleanup animation on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Public API
  const openPanel = useCallback((animated = true) => {
    setIsPanelOpen(true);
  }, []);

  const closePanel = useCallback((animated = true) => {
    setIsPanelOpen(false);
  }, []);

  const togglePanel = useCallback((animated = true) => {
    setIsPanelOpen(prev => !prev);
  }, []);

  const setZoom = useCallback((zoom: number, animated = true) => {
    const newState = { ...layoutState, zoom };
    
    if (animated) {
      animateLayoutChange(layoutState, newState);
    } else {
      setLayoutState(newState);
      onLayoutChange?.(newState);
    }
  }, [layoutState, animateLayoutChange, onLayoutChange]);

  const setPan = useCallback((panX: number, panY: number, animated = true) => {
    const newState = { ...layoutState, panX, panY };
    
    if (animated) {
      animateLayoutChange(layoutState, newState);
    } else {
      setLayoutState(newState);
      onLayoutChange?.(newState);
    }
  }, [layoutState, animateLayoutChange, onLayoutChange]);

  const fitToCanvas = useCallback((animated = true) => {
    // Calculate zoom to fit content in available canvas space
    const { canvasWidth, canvasHeight } = calculateCanvasDimensions();
    const contentWidth = 800; // Default content width
    const contentHeight = 600; // Default content height
    
    const scaleX = canvasWidth / contentWidth;
    const scaleY = canvasHeight / contentHeight;
    const optimalZoom = Math.min(scaleX, scaleY, 1); // Don't zoom in beyond 100%
    
    const centerX = (canvasWidth - contentWidth * optimalZoom) / 2;
    const centerY = (canvasHeight - contentHeight * optimalZoom) / 2;
    
    const newState = {
      ...layoutState,
      zoom: optimalZoom,
      panX: centerX,
      panY: centerY,
    };
    
    if (animated) {
      animateLayoutChange(layoutState, newState);
    } else {
      setLayoutState(newState);
      onLayoutChange?.(newState);
    }
  }, [calculateCanvasDimensions, layoutState, animateLayoutChange, onLayoutChange]);

  const resetView = useCallback((animated = true) => {
    const newState = {
      ...layoutState,
      zoom: 1,
      panX: 0,
      panY: 0,
    };
    
    if (animated) {
      animateLayoutChange(layoutState, newState);
    } else {
      setLayoutState(newState);
      onLayoutChange?.(newState);
    }
  }, [layoutState, animateLayoutChange, onLayoutChange]);

  // Get canvas transform styles
