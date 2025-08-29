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
    iconSize = 'md',
    orientation = 'horizontal',
  } = config;

  const [hoveredTool, setHoveredTool] = useState<ToolType | null>(null);

  const handleToolClick = useCallback((toolId: ToolType) => {
    if (disabled.includes(toolId)) return;
    onToolSelect(toolId);
  }, [onToolSelect, disabled]);

  const getIconSize = () => {
    switch (iconSize) {
      case 'sm': return 'h-4 w-4';
      case 'lg': return 'h-6 w-6';
      default: return 'h-5 w-5';
    }
  };

  const getButtonSize = () => {
    // Ensure 44px minimum touch target
    return 'h-11 w-11 min-h-[44px] min-w-[44px]';
  };

  const renderTool = (tool: Tool) => {
    const isSelected = selectedTool === tool.id;
    const isDisabled = disabled.includes(tool.id);
    const isHovered = hoveredTool === tool.id;
    const IconComponent = tool.icon;

    const tooltipContent = (
      <div className="text-center">
        <div className="font-medium">{tool.name}</div>
        {showShortcuts && tool.shortcut && (
          <div className="text-xs text-gray-400 mt-1">
            Press {tool.shortcut}
          </div>
        )}
        <div className="text-xs text-gray-400 mt-1">
          {tool.description}
        </div>
      </div>
    );

    return (
      <Tooltip key={tool.id}>
        <TooltipTrigger asChild>
          <Button
            variant={isSelected ? 'default' : 'ghost'}
            size="sm"
            className={cn(
              getButtonSize(),
              'p-0 relative transition-all duration-200',
              isSelected && 'bg-blue-600 hover:bg-blue-700 text-white',
              !isSelected && 'hover:bg-gray-100 dark:hover:bg-gray-800',
              isDisabled && 'opacity-50 cursor-not-allowed',
              isHovered && !isSelected && 'scale-105'
            )}
            onClick={() => handleToolClick(tool.id)}
            onMouseEnter={() => setHoveredTool(tool.id)}
            onMouseLeave={() => setHoveredTool(null)}
            disabled={isDisabled}
            aria-label={`${tool.name} tool${tool.shortcut ? ` (${tool.shortcut})` : ''}`}
          >
            <IconComponent className={cn(getIconSize(), 'transition-transform')} />
            
            {/* Active indicator */}
            {isSelected && (
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full" />
            )}
            
            {/* Keyboard shortcut overlay */}
            {showShortcuts && tool.shortcut && !showLabels && (
              <div className="absolute -top-1 -right-1 bg-gray-800 text-white text-xs rounded px-1 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                {tool.shortcut}
              </div>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side={orientation === 'horizontal' ? 'bottom' : 'right'}>
          {tooltipContent}
        </TooltipContent>
      </Tooltip>
    );
  };

  return (
    <TooltipProvider>
      <div className={cn(
        'flex gap-1 p-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg',
        orientation === 'vertical' ? 'flex-col' : 'flex-row flex-wrap',
        className
      )}>
        {DEFAULT_TOOLS.map(renderTool)}
        
