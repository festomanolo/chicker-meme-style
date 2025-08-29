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
