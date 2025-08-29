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
          <EyeOff className="h-3 w-3 text-gray-400" />
        )}
        
        {/* Group lock indicator */}
        {group.locked && (
          <Lock className="h-3 w-3 text-gray-400" />
        )}
      </div>

      {group.expanded && (
        <div className="ml-6 mt-2 space-y-1" data-testid={`group-content-${group.id}`}>
          {groupLayers.length === 0 ? (
            <div className="text-xs text-gray-500 italic p-2">
              No layers in this group
            </div>
          ) : (
            groupLayers.map(layer => (
              <LayerItem
                key={keyManager.getGroupKey(layer.id, group.id)}
                layer={layer}
                isSelected={selectedIds.includes(layer.id)}
                isEditing={enableInlineEdit && editingLayerId === layer.id}
                showThumbnail={showThumbnails}
                onSelect={onLayerSelect}
                onUpdate={onLayerUpdate}
                onDelete={onLayerDelete}
                onDuplicate={onLayerDuplicate}
                onVisibilityToggle={onLayerVisibilityToggle}
                onLockToggle={onLayerLockToggle}
                onStartEdit={onStartEdit}
                onEndEdit={onEndEdit}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export const LayersPanel: React.FC<LayersPanelProps> = ({
  layers,
  groups,
  selectedIds,
  onLayerSelect,
  onLayerReorder,
  onLayerUpdate,
  onLayerDelete,
  onLayerDuplicate,
  onLayerVisibilityToggle,
  onLayerLockToggle,
  onGroupToggle,
  onGroupVisibilityToggle,
  onGroupLockToggle,
  searchQuery = '',
  onSearchChange,
  filter = {},
  className,
  showThumbnails = true,
  enableInlineEdit = true,
  enableDragReorder = true,
}) => {
  const [editingLayerId, setEditingLayerId] = useState<string | null>(null);
  const [draggedLayerId, setDraggedLayerId] = useState<string | null>(null);

  // Initialize centralized key management
  const keyManager = useLayerKeys();

  // Development-time key validation
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const isValid = keyManager.validateKeys();
      if (!isValid) {
        console.warn('LayersPanel: Duplicate keys detected', keyManager.getDebugInfo());
      }
    }
  }, [layers, groups, searchQuery, keyManager]);

  // Get layers that belong to groups to avoid duplication
  const groupedLayerIds = useMemo(() => {
    const ids = new Set<string>();
    groups.forEach(group => {
      group.children.forEach(layerId => ids.add(layerId));
    });
    return ids;
  }, [groups]);

  // Filter and sort layers - exclude grouped layers from individual list
  const filteredLayers = useMemo(() => {
    let filtered = [...layers];

    // First, exclude layers that belong to groups (to prevent duplication)
    filtered = filtered.filter(layer => !groupedLayerIds.has(layer.id));

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(layer =>
        layer.name.toLowerCase().includes(query) ||
        layer.content?.toLowerCase().includes(query) ||
        layer.type.toLowerCase().includes(query)
      );
    }

    // Apply type filter
    if (filter.type && filter.type.length > 0) {
      filtered = filtered.filter(layer => filter.type!.includes(layer.type));
    }

    // Apply visibility filter
    if (filter.visible !== undefined) {
      filtered = filtered.filter(layer => layer.visible === filter.visible);
    }

    // Apply lock filter
    if (filter.locked !== undefined) {
      filtered = filtered.filter(layer => layer.locked === filter.locked);
    }

    // Sort by z-index (layer order)
    return filtered.sort((a, b) => b.zIndex - a.zIndex);
  }, [layers, groupedLayerIds, searchQuery, filter]);

  // For search results, we need to show all matching layers including grouped ones
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    const query = searchQuery.toLowerCase();
    return layers.filter(layer =>
      layer.name.toLowerCase().includes(query) ||
      layer.content?.toLowerCase().includes(query) ||
      layer.type.toLowerCase().includes(query)
    ).sort((a, b) => b.zIndex - a.zIndex);
  }, [layers, searchQuery]);

  // Handle drag and drop reordering
  const handleDragStart = useCallback((e: React.DragEvent, layerId: string) => {
    setDraggedLayerId(layerId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', layerId);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, targetLayerId: string) => {
    e.preventDefault();
    
    if (!draggedLayerId || draggedLayerId === targetLayerId) return;

    const draggedIndex = layers.findIndex(l => l.id === draggedLayerId);
    const targetIndex = layers.findIndex(l => l.id === targetLayerId);

    if (draggedIndex !== -1 && targetIndex !== -1) {
      onLayerReorder(draggedLayerId, targetIndex);
    }

    setDraggedLayerId(null);
  }, [draggedLayerId, layers, onLayerReorder]);

  const handleDragEnd = useCallback(() => {
    setDraggedLayerId(null);
  }, []);

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Search bar */}
      {onSearchChange && (
        <div className="p-3 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search layers..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
