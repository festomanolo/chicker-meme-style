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
        <div className="opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing">
          <GripVertical className="h-4 w-4 text-gray-400" />
        </div>
      )}

      {/* Thumbnail */}
      {showThumbnail && (
        <LayerThumbnail layer={layer} size={32} />
      )}

      {/* Layer info */}
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <Input
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onBlur={handleNameSubmit}
            onKeyDown={handleKeyDown}
            className="h-6 text-sm"
            autoFocus
          />
        ) : (
          <div className="flex items-center gap-2">
            <LayerTypeIcon type={layer.type} />
            <span className="text-sm font-medium truncate">{layer.name}</span>
            {layer.groupId && (
              <Badge variant="secondary" className="text-xs">
                Grouped
              </Badge>
            )}
          </div>
        )}
        
        {/* Layer details */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
          <span>{layer.type}</span>
          {layer.content && (
            <>
              <span>•</span>
              <span className="truncate max-w-20">{layer.content}</span>
            </>
          )}
          <span>•</span>
          <span>{Math.round(layer.opacity * 100)}%</span>
        </div>
      </div>

      {/* Layer controls */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0"
          onClick={(e) => {
            e.stopPropagation();
            onVisibilityToggle(layer.id);
          }}
          aria-label={layer.visible ? 'Hide layer' : 'Show layer'}
        >
          {layer.visible ? (
            <Eye className="h-3 w-3" />
          ) : (
            <EyeOff className="h-3 w-3" />
          )}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0"
          onClick={(e) => {
            e.stopPropagation();
            onLockToggle(layer.id);
          }}
          aria-label={layer.locked ? 'Unlock layer' : 'Lock layer'}
        >
          {layer.locked ? (
            <Lock className="h-3 w-3" />
          ) : (
            <Unlock className="h-3 w-3" />
          )}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0"
          onClick={(e) => {
            e.stopPropagation();
            onDuplicate(layer.id);
          }}
          aria-label="Duplicate layer"
        >
          <Copy className="h-3 w-3" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 text-red-500 hover:text-red-600"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(layer.id);
          }}
          aria-label="Delete layer"
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};

const GroupItem: React.FC<{
  group: LayerGroup;
  layers: LayerElement[];
  selectedIds: string[];
  showThumbnails: boolean;
  enableInlineEdit: boolean;
  editingLayerId: string | null;
  onToggle: (groupId: string) => void;
  onLayerSelect: (elementId: string, multiSelect?: boolean) => void;
  onLayerUpdate: (elementId: string, updates: Partial<LayerElement>) => void;
  onLayerDelete: (elementId: string) => void;
  onLayerDuplicate: (elementId: string) => void;
  onLayerVisibilityToggle: (elementId: string) => void;
  onLayerLockToggle: (elementId: string) => void;
  onStartEdit: (id: string) => void;
  onEndEdit: () => void;
  onGroupVisibilityToggle?: (groupId: string) => void;
  onGroupLockToggle?: (groupId: string) => void;
}> = ({ 
  group, 
  layers, 
  selectedIds,
  showThumbnails,
  enableInlineEdit,
  editingLayerId,
  onToggle,
  onLayerSelect,
  onLayerUpdate,
  onLayerDelete,
  onLayerDuplicate,
  onLayerVisibilityToggle,
  onLayerLockToggle,
  onStartEdit,
  onEndEdit,
  onGroupVisibilityToggle,
  onGroupLockToggle
}) => {
  // Use centralized key management within the component
  const keyManager = useLayerKeys();
  const groupLayers = layers.filter(layer => group.children.includes(layer.id));

  return (
    <div className="mb-2" data-testid={`layer-group-${group.id}`}>
      <div
        className={cn(
          "flex items-center gap-2 p-2 rounded-md bg-gray-100 dark:bg-gray-800 cursor-pointer transition-colors",
          "hover:bg-gray-200 dark:hover:bg-gray-700",
          !group.visible && "opacity-50",
          group.locked && "opacity-60"
        )}
        onClick={() => onToggle(group.id)}
        data-testid={`group-header-${group.id}`}
      >
        {group.expanded ? (
          <ChevronDown className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
        <span className="font-medium text-sm flex-1">{group.name}</span>
        <Badge variant="outline" className="text-xs">
          {group.children.length}
        </Badge>
        
        {/* Group visibility indicator */}
        {!group.visible && (
