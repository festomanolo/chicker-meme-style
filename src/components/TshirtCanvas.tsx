import React, { useRef, useCallback, useState, useEffect } from 'react';
import { DesignElement } from '@/types/design';

interface TshirtCanvasProps {
  selectedColor: string;
  selectedType: string;
  designElements: DesignElement[];
  selectedElement: string | null;
  onElementSelect: (id: string | null) => void;
  onElementUpdate: (id: string, updates: Partial<DesignElement>) => void;
  canvasZoom: number;
}

export const TshirtCanvas: React.FC<TshirtCanvasProps> = ({
  selectedColor,
  selectedType,
  designElements,
  selectedElement,
  onElementSelect,
  onElementUpdate,
  canvasZoom
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);

  // T-shirt image mapping
  const getTshirtImage = () => {
    const baseUrl = '/api/placeholder/400/500'; // Replace with actual t-shirt images
    return `${baseUrl}?color=${encodeURIComponent(selectedColor)}&type=${selectedType}`;
  };

  const handleMouseDown = useCallback((e: React.MouseEvent, elementId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    const element = designElements.find(el => el.id === elementId);
    if (!element || element.locked) return;

    onElementSelect(elementId);
    
    const target = e.target as HTMLElement;
    const isResizeHandle = target.classList.contains('resize-handle');
    
    if (isResizeHandle) {
      setIsResizing(true);
      setResizeHandle(target.dataset.handle || null);
    } else {
      setIsDragging(true);
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        setDragOffset({
          x: e.clientX - rect.left - element.x,
          y: e.clientY - rect.top - element.y,
        });
      }
    }
  }, [designElements, onElementSelect]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!selectedElement || !canvasRef.current) return;

    const element = designElements.find(el => el.id === selectedElement);
    if (!element) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const canvasX = e.clientX - rect.left;
    const canvasY = e.clientY - rect.top;

    if (isDragging) {
      const newX = Math.max(0, Math.min(300 - (element.width || 50), canvasX - dragOffset.x));
      const newY = Math.max(0, Math.min(400 - (element.height || 50), canvasY - dragOffset.y));
      
      onElementUpdate(selectedElement, { x: newX, y: newY });
    } else if (isResizing && resizeHandle) {
      const centerX = element.x + (element.width || 50) / 2;
      const centerY = element.y + (element.height || 50) / 2;
      
      let newWidth = element.width || 50;
      let newHeight = element.height || 50;
      let newX = element.x;
      let newY = element.y;

      switch (resizeHandle) {
        case 'nw':
          newWidth = Math.max(20, (centerX - canvasX) * 2);
          newHeight = Math.max(20, (centerY - canvasY) * 2);
          newX = centerX - newWidth / 2;
          newY = centerY - newHeight / 2;
          break;
        case 'ne':
          newWidth = Math.max(20, (canvasX - centerX) * 2);
          newHeight = Math.max(20, (centerY - canvasY) * 2);
          newX = centerX - newWidth / 2;
          newY = centerY - newHeight / 2;
          break;
        case 'sw':
          newWidth = Math.max(20, (centerX - canvasX) * 2);
          newHeight = Math.max(20, (canvasY - centerY) * 2);
          newX = centerX - newWidth / 2;
          newY = centerY - newHeight / 2;
          break;
        case 'se':
          newWidth = Math.max(20, (canvasX - centerX) * 2);
          newHeight = Math.max(20, (canvasY - centerY) * 2);
          newX = centerX - newWidth / 2;
          newY = centerY - newHeight / 2;
          break;
      }

      onElementUpdate(selectedElement, {
        width: newWidth,
        height: newHeight,
        x: newX,
        y: newY
      });
    }
  }, [isDragging, isResizing, selectedElement, dragOffset, resizeHandle, designElements, onElementUpdate]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeHandle(null);
  }, []);

  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp]);

  const ResizeHandles: React.FC<{ elementId: string }> = ({ elementId }) => {
    if (selectedElement !== elementId) return null;

    return (
      <>
        {['nw', 'ne', 'sw', 'se'].map(handle => (
          <div
            key={handle}
            className={`resize-handle absolute w-3 h-3 bg-blue-500 border-2 border-white rounded-full cursor-${handle}-resize shadow-lg`}
            data-handle={handle}
            style={{
              top: handle.includes('n') ? -6 : 'auto',
              bottom: handle.includes('s') ? -6 : 'auto',
              left: handle.includes('w') ? -6 : 'auto',
              right: handle.includes('e') ? -6 : 'auto',
            }}
          />
        ))}
      </>
    );
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
      <div 
        className="relative"
        style={{ transform: `scale(${canvasZoom / 100})` }}
      >
        {/* Realistic T-shirt Image */}
        <div className="relative">
          <img
            src={getTshirtImage()}
            alt="T-shirt"
            className="w-96 h-auto drop-shadow-2xl"
            style={{
              filter: `hue-rotate(${selectedColor === '#000000' ? '0deg' : selectedColor === '#FFFFFF' ? '0deg' : '180deg'}) brightness(${selectedColor === '#000000' ? '0.3' : selectedColor === '#FFFFFF' ? '1.2' : '0.8'})`
            }}
          />
          
          {/* Design Area Overlay */}
          <div
            ref={canvasRef}
            className="absolute top-20 left-1/2 transform -translate-x-1/2 w-72 h-80 cursor-crosshair"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                onElementSelect(null);
              }
            }}
            style={{
              background: selectedElement ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
              border: selectedElement ? '2px dashed rgba(59, 130, 246, 0.5)' : 'none'
            }}
          >
            {/* Design Elements */}
            {designElements.map(element => (
              element.visible && (
                <div
                  key={element.id}
                  className={`absolute select-none transition-all duration-200 ${
                    selectedElement === element.id ? 'ring-2 ring-blue-400 shadow-lg' : ''
                  } ${element.locked ? 'cursor-not-allowed' : 'cursor-move'}`}
                  style={{
                    left: element.x,
                    top: element.y,
                    width: element.width || 'auto',
                    height: element.height || 'auto',
                    transform: `rotate(${element.rotation}deg)`,
                    opacity: element.opacity,
                    zIndex: selectedElement === element.id ? 20 : 10,
                  }}
                  onMouseDown={(e) => handleMouseDown(e, element.id)}
                >
                  {element.type === 'text' && (
                    <span
                      style={{
                        fontFamily: element.font,
                        fontSize: `${element.size}px`,
                        color: element.color,
