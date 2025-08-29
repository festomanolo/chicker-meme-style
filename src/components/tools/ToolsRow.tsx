// Photoshop-like tools row with 44px touch targets
import React, { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Move, 
  Crop, 
  Type, 
  Image, 
  Scissors,
  PenTool,
  Pipette,
  ZoomIn,
  Hand
} from 'lucide-react';
import { Tool, ToolType, ToolbarConfig } from '@/types/tools';

interface ToolsRowProps {
  selectedTool: ToolType | null;
  onToolSelect: (tool: ToolType) => void;
  config?: ToolbarConfig;
  className?: string;
  disabled?: ToolType[];
}

const DEFAULT_TOOLS: Tool[] = [
  {
    id: 'move',
    name: 'Move',
    icon: Move,
    shortcut: 'V',
    description: 'Move and transform elements',
    category: 'selection',
  },
  {
    id: 'crop',
    name: 'Crop',
    icon: Crop,
    shortcut: 'C',
    description: 'Crop images',
    category: 'editing',
  },
  {
    id: 'text',
    name: 'Text',
    icon: Type,
    shortcut: 'T',
    description: 'Add text elements',
    category: 'drawing',
  },
  {
    id: 'image',
    name: 'Image',
    icon: Image,
    shortcut: 'I',
    description: 'Replace or add images',
    category: 'editing',
  },
  {
    id: 'mask',
    name: 'Mask',
    icon: Scissors,
    shortcut: 'M',
    description: 'Create masks and selections',
    category: 'editing',
  },
  {
    id: 'pen',
    name: 'Pen',
    icon: PenTool,
    shortcut: 'P',
    description: 'Draw vector paths',
    category: 'drawing',
  },
  {
    id: 'eyedropper',
    name: 'Eyedropper',
    icon: Pipette,
    shortcut: 'E',
    description: 'Sample colors',
    category: 'selection',
  },
];

export const ToolsRow: React.FC<ToolsRowProps> = ({
  selectedTool,
  onToolSelect,
  config = {},
  className,
  disabled = [],
}) => {
  const {
    showLabels = false,
    showShortcuts = true,
