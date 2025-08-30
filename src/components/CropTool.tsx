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
    setIsDragging(false);
  }, []);

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const handleApplyCrop = () => {
    if (cropArea.width > 10 && cropArea.height > 10) {
      onCrop(element.id, cropArea);
    }
  };

  if (element.type !== 'image') return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg p-6 max-w-2xl w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Crop className="h-5 w-5" />
            Crop Image
          </h3>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="relative mb-4">
          <div
            ref={cropRef}
            className="relative border-2 border-dashed border-gray-300 cursor-crosshair"
            style={{
              width: element.width || 300,
              height: element.height || 300,
              maxWidth: '100%',
              maxHeight: '400px'
            }}
            onMouseDown={handleMouseDown}
          >
            <img
              src={element.imageUrl}
              alt="Crop preview"
              className="w-full h-full object-cover"
              draggable={false}
            />
            
            {/* Crop overlay */}
            <div
              className="absolute border-2 border-blue-500 bg-blue-500/20"
              style={{
                left: cropArea.x,
                top: cropArea.y,
                width: cropArea.width,
                height: cropArea.height,
                pointerEvents: 'none'
              }}
            />
            
            {/* Crop handles */}
            {cropArea.width > 0 && cropArea.height > 0 && (
              <>
                {['nw', 'ne', 'sw', 'se'].map(handle => (
                  <div
                    key={handle}
                    className="absolute w-3 h-3 bg-blue-500 border-2 border-white rounded-full"
                    style={{
                      left: handle.includes('w') ? cropArea.x - 6 : cropArea.x + cropArea.width - 6,
                      top: handle.includes('n') ? cropArea.y - 6 : cropArea.y + cropArea.height - 6,
                      cursor: `${handle}-resize`
                    }}
                  />
                ))}
              </>
            )}
          </div>
        </div>
        
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button 
            onClick={handleApplyCrop}
            disabled={cropArea.width < 10 || cropArea.height < 10}
          >
            <Check className="h-4 w-4 mr-2" />
            Apply Crop
          </Button>
        </div>
      </div>
    </div>
  );
};