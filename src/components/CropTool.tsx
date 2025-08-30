import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Crop, Check, X } from 'lucide-react';
import { DesignElement } from '@/types/design';

interface CropToolProps {
  element: DesignElement;
  onCrop: (elementId: string, cropData: { x: number; y: number; width: number; height: number }) => void;
  onCancel: () => void;
}

export const CropTool: React.FC<CropToolProps> = ({ element, onCrop, onCancel }) => {
  const [cropArea, setCropArea] = useState({
    x: 0,
    y: 0,
    width: element.width || 100,
    height: element.height || 100
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const cropRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!cropRef.current) return;
    
    const rect = cropRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setIsDragging(true);
    setDragStart({ x, y });
    setCropArea({ x, y, width: 0, height: 0 });
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !cropRef.current) return;
    
    const rect = cropRef.current.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;
    
    const width = Math.abs(currentX - dragStart.x);
    const height = Math.abs(currentY - dragStart.y);
    const x = Math.min(dragStart.x, currentX);
    const y = Math.min(dragStart.y, currentY);
    
    setCropArea({ x, y, width, height });
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
