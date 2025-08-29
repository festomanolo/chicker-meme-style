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
    </div>
    
    <div>
      <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Font Size</label>
      <input
        type="number"
        value={element.fontSize || 16}
        onChange={(e) => onUpdate({ fontSize: parseFloat(e.target.value) || 16 })}
        className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
        min="8"
        max="200"
      />
    </div>
    
    <div>
      <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Font Family</label>
      <select
        value={element.fontFamily || 'Arial'}
        onChange={(e) => onUpdate({ fontFamily: e.target.value })}
        className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
      >
        <option value="Arial">Arial</option>
        <option value="Helvetica">Helvetica</option>
        <option value="Times New Roman">Times New Roman</option>
        <option value="Georgia">Georgia</option>
        <option value="Verdana">Verdana</option>
      </select>
    </div>
    
    <div>
      <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Text Color</label>
      <input
        type="color"
        value={element.color || '#000000'}
        onChange={(e) => onUpdate({ color: e.target.value })}
        className="w-full h-8 border border-gray-300 dark:border-gray-600 rounded"
      />
    </div>
  </div>
);

// Image properties component
const ImageProperties: React.FC<{
  element: LayerElement;
  onUpdate: (updates: Partial<LayerElement>) => void;
}> = ({ element, onUpdate }) => (
  <div className="space-y-3">
    <div>
      <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Image URL</label>
      <input
        type="url"
        value={element.imageUrl || ''}
        onChange={(e) => onUpdate({ imageUrl: e.target.value })}
        className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
        placeholder="https://example.com/image.jpg"
      />
    </div>
    
    <div>
      <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Fit Mode</label>
      <select
        value={element.objectFit || 'cover'}
        onChange={(e) => onUpdate({ objectFit: e.target.value as any })}
        className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
      >
        <option value="cover">Cover</option>
        <option value="contain">Contain</option>
        <option value="fill">Fill</option>
        <option value="none">None</option>
      </select>
    </div>
    
    {element.cropData && (
      <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
        <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Crop Info</div>
        <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
          <div>Position: {Math.round(element.cropData.x)}, {Math.round(element.cropData.y)}</div>
          <div>Size: {Math.round(element.cropData.width)} × {Math.round(element.cropData.height)}</div>
        </div>
      </div>
    )}
  </div>
);

// Quick actions component
const QuickActions: React.FC<{
  element: LayerElement | null;
  onAction: (action: string) => void;
}> = ({ element, onAction }) => (
  <div className="space-y-2">
    <div className="grid grid-cols-2 gap-2">
      <button
        onClick={() => onAction('duplicate')}
        disabled={!element}
        className="px-3 py-2 text-xs bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded disabled:opacity-50"
      >
        Duplicate
      </button>
      <button
        onClick={() => onAction('delete')}
        disabled={!element}
        className="px-3 py-2 text-xs bg-red-100 dark:bg-red-900/20 hover:bg-red-200 dark:hover:bg-red-900/40 text-red-700 dark:text-red-400 rounded disabled:opacity-50"
      >
        Delete
      </button>
    </div>
    
    <div className="grid grid-cols-2 gap-2">
      <button
        onClick={() => onAction('bring-forward')}
        disabled={!element}
        className="px-3 py-2 text-xs bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded disabled:opacity-50"
      >
        Bring Forward
      </button>
      <button
        onClick={() => onAction('send-backward')}
        disabled={!element}
        className="px-3 py-2 text-xs bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded disabled:opacity-50"
      >
        Send Backward
      </button>
    </div>
    
    {element && (
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => onAction('lock')}
          className="px-3 py-2 text-xs bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
        >
          {element.locked ? 'Unlock' : 'Lock'}
        </button>
        <button
          onClick={() => onAction('visibility')}
          className="px-3 py-2 text-xs bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
        >
          {element.visible ? 'Hide' : 'Show'}
        </button>
      </div>
    )}
  </div>
);

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedTool,
  selectedElement,
  onElementUpdate,
  className,
}) => {
  const handleElementUpdate = (updates: Partial<LayerElement>) => {
    if (selectedElement && onElementUpdate) {
      onElementUpdate(selectedElement.id, updates);
    }
  };

  const handleQuickAction = (action: string) => {
    if (!selectedElement) return;
    
    switch (action) {
      case 'duplicate':
        // Handle duplication
        break;
      case 'delete':
        // Handle deletion
        break;
      case 'bring-forward':
        handleElementUpdate({ zIndex: selectedElement.zIndex + 1 });
        break;
      case 'send-backward':
        handleElementUpdate({ zIndex: Math.max(0, selectedElement.zIndex - 1) });
        break;
      case 'lock':
