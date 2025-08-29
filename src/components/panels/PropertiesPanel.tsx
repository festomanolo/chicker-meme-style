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
          className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
        />
      </div>
      <div>
        <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Height</label>
        <input
          type="number"
          value={Math.round(element.height)}
          onChange={(e) => onUpdate({ height: parseFloat(e.target.value) || 1 })}
          className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
        />
      </div>
    </div>
    
    <div>
      <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Rotation</label>
      <input
        type="range"
        min="-180"
        max="180"
        value={element.rotation}
        onChange={(e) => onUpdate({ rotation: parseFloat(e.target.value) })}
        className="w-full"
      />
      <div className="text-xs text-gray-500 text-center">{Math.round(element.rotation)}°</div>
    </div>
    
    <div>
      <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Opacity</label>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={element.opacity}
        onChange={(e) => onUpdate({ opacity: parseFloat(e.target.value) })}
        className="w-full"
      />
      <div className="text-xs text-gray-500 text-center">{Math.round(element.opacity * 100)}%</div>
    </div>
  </div>
);

// Text properties component
const TextProperties: React.FC<{
  element: LayerElement;
  onUpdate: (updates: Partial<LayerElement>) => void;
}> = ({ element, onUpdate }) => (
  <div className="space-y-3">
    <div>
      <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Text Content</label>
      <textarea
        value={element.content || ''}
        onChange={(e) => onUpdate({ content: e.target.value })}
        className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 resize-none"
        rows={3}
      />
