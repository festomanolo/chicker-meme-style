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
