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
