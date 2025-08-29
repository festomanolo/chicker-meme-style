// Layers panel component with drag-and-drop reordering and inline editing
import React, { useState, useCallback, useMemo } from 'react';
import { LayerElement, LayerGroup, LayerFilter } from '@/types/layer';
import { cn } from '@/lib/utils';
import { useLayerKeys, useDuplicateDetection } from '@/lib/layer-key-manager';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Eye, 
  EyeOff, 
  Lock, 
  Unlock, 
  Trash2, 
  Copy, 
  Search,
  ChevronDown,
  ChevronRight,
  GripVertical,
  Type,
  Image,
  Square,
  Sticker,
  FileImage
} from 'lucide-react';

interface LayersPanelProps {
  layers: LayerElement[];
  groups: LayerGroup[];
  selectedIds: string[];
  onLayerSelect: (elementId: string, multiSelect?: boolean) => void;
  onLayerReorder: (elementId: string, newIndex: number) => void;
  onLayerUpdate: (elementId: string, updates: Partial<LayerElement>) => void;
  onLayerDelete: (elementId: string) => void;
  onLayerDuplicate: (elementId: string) => void;
  onLayerVisibilityToggle: (elementId: string) => void;
  onLayerLockToggle: (elementId: string) => void;
  onGroupToggle?: (groupId: string) => void;
  onGroupVisibilityToggle?: (groupId: string) => void;
  onGroupLockToggle?: (groupId: string) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  filter?: LayerFilter;
  className?: string;
  showThumbnails?: boolean;
  enableInlineEdit?: boolean;
  enableDragReorder?: boolean;
}

const LayerTypeIcon: React.FC<{ type: LayerElement['type'] }> = ({ type }) => {
  const iconProps = { className: "h-4 w-4" };
  
  switch (type) {
    case 'text':
      return <Type {...iconProps} />;
    case 'image':
      return <Image {...iconProps} />;
    case 'shape':
      return <Square {...iconProps} />;
    case 'sticker':
      return <Sticker {...iconProps} />;
    case 'template':
      return <FileImage {...iconProps} />;
    default:
      return <Square {...iconProps} />;
  }
};

const LayerThumbnail: React.FC<{ layer: LayerElement; size?: number }> = ({ 
  layer, 
  size = 32 
}) => {
  if (layer.thumbnail) {
    return (
      <img
        src={layer.thumbnail}
        alt={`${layer.name} thumbnail`}
        className="rounded border bg-gray-100"
        style={{ width: size, height: size }}
      />
    );
  }

  // Generate thumbnail based on layer type
  return (
    <div
      className="flex items-center justify-center rounded border bg-gray-100 text-gray-500"
      style={{ width: size, height: size }}
    >
      <LayerTypeIcon type={layer.type} />
    </div>
  );
};

const LayerItem: React.FC<{
  layer: LayerElement;
  isSelected: boolean;
  isEditing: boolean;
  showThumbnail: boolean;
  onSelect: (id: string, multiSelect?: boolean) => void;
  onUpdate: (id: string, updates: Partial<LayerElement>) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onVisibilityToggle: (id: string) => void;
  onLockToggle: (id: string) => void;
  onStartEdit: (id: string) => void;
  onEndEdit: () => void;
  onDragStart?: (e: React.DragEvent, id: string) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent, targetId: string) => void;
}> = ({
  layer,
  isSelected,
  isEditing,
  showThumbnail,
  onSelect,
  onUpdate,
  onDelete,
  onDuplicate,
  onVisibilityToggle,
  onLockToggle,
  onStartEdit,
  onEndEdit,
  onDragStart,
  onDragOver,
  onDrop,
}) => {
  const [editName, setEditName] = useState(layer.name);

  const handleNameSubmit = useCallback(() => {
    if (editName.trim() && editName !== layer.name) {
      onUpdate(layer.id, { name: editName.trim() });
    }
    onEndEdit();
  }, [editName, layer.name, layer.id, onUpdate, onEndEdit]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNameSubmit();
    } else if (e.key === 'Escape') {
      setEditName(layer.name);
      onEndEdit();
    }
  }, [handleNameSubmit, layer.name, onEndEdit]);

  const handleClick = useCallback((e: React.MouseEvent) => {
    onSelect(layer.id, e.ctrlKey || e.metaKey);
  }, [layer.id, onSelect]);

  const handleDoubleClick = useCallback(() => {
    if (!layer.locked) {
      onStartEdit(layer.id);
    }
  }, [layer.id, layer.locked, onStartEdit]);

  return (
    <div
      className={cn(
        "group flex items-center gap-2 p-2 rounded-md border transition-all duration-150",
        "hover:bg-gray-50 dark:hover:bg-gray-800",
        isSelected && "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
        layer.locked && "opacity-60",
        !layer.visible && "opacity-40"
      )}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      draggable={onDragStart && !layer.locked}
      onDragStart={onDragStart ? (e) => onDragStart(e, layer.id) : undefined}
      onDragOver={onDragOver}
      onDrop={onDrop ? (e) => onDrop(e, layer.id) : undefined}
      role="button"
      tabIndex={0}
      aria-label={`Layer: ${layer.name}`}
      aria-selected={isSelected}
      data-testid={`layer-item-${layer.id}`}
    >
      {/* Drag handle */}
      {onDragStart && (
