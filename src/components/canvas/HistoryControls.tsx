// History controls component with undo/redo buttons
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Undo2, Redo2, History, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HistoryControlsProps {
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onClear?: () => void;
  stats?: {
    totalEntries: number;
    memoryUsage: number;
  };
  className?: string;
  showStats?: boolean;
  showClear?: boolean;
}

export const HistoryControls: React.FC<HistoryControlsProps> = ({
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onClear,
  stats,
  className,
  showStats = false,
  showClear = false,
}) => {
  const formatMemoryUsage = (bytes: number): string => {
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  };

  return (
    <TooltipProvider>
      <div className={cn("flex items-center gap-2", className)}>
        {/* Undo button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={onUndo}
              disabled={!canUndo}
              className="h-8 px-2"
            >
              <Undo2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Undo (Ctrl+Z)</p>
          </TooltipContent>
        </Tooltip>

        {/* Redo button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={onRedo}
              disabled={!canRedo}
              className="h-8 px-2"
            >
              <Redo2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
