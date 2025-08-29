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
