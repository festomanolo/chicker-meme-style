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
