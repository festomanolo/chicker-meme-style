// Context-sensitive properties panel
import React, { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { CollapsibleSection } from './CollapsibleSection';
import { LayerElement } from '@/types/layer';
import { ToolType } from '@/types/tools';
import { 
  Layers, 
  Settings, 
  Palette, 
  Move, 
  Type, 
  Image as ImageIcon,
  Zap
} from 'lucide-react';

interface PropertiesPanelProps {
  selectedTool: ToolType | null;
  selectedElement: LayerElement | null;
  onElementUpdate?: (elementId: string, updates: Partial<LayerElement>) => void;
  className?: string;
}

// Transform properties component
const TransformProperties: React.FC<{
  element: LayerElement;
  onUpdate: (updates: Partial<LayerElement>) => void;
}> = ({ element, onUpdate }) => (
  <div className="space-y-3">
    <div className="grid grid-cols-2 gap-2">
      <div>
        <label className="text-xs font-medium text-gray-700 dark:text-gray-300">X</label>
        <input
          type="number"
          value={Math.round(element.x)}
          onChange={(e) => onUpdate({ x: parseFloat(e.target.value) || 0 })}
          className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
        />
      </div>
      <div>
        <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Y</label>
        <input
          type="number"
          value={Math.round(element.y)}
          onChange={(e) => onUpdate({ y: parseFloat(e.target.value) || 0 })}
          className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
        />
      </div>
    </div>
    
    <div className="grid grid-cols-2 gap-2">
      <div>
        <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Width</label>
        <input
          type="number"
          value={Math.round(element.width)}
          onChange={(e) => onUpdate({ width: parseFloat(e.target.value) || 1 })}
