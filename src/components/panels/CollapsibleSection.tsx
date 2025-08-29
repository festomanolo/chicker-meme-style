// Collapsible section component for panel organization
import React, { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface CollapsibleSectionProps {
  title: string;
  icon?: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  isExpanded?: boolean;
  onToggle?: (expanded: boolean) => void;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  disabled?: boolean;
  showToggleIcon?: boolean;
}

export const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  icon: IconComponent,
  children,
  defaultExpanded = true,
  isExpanded: controlledExpanded,
  onToggle,
  className,
  headerClassName,
  contentClassName,
  disabled = false,
  showToggleIcon = true,
}) => {
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);
  
  const isControlled = controlledExpanded !== undefined;
  const isExpanded = isControlled ? controlledExpanded : internalExpanded;

  const handleToggle = useCallback(() => {
    if (disabled) return;
    
    const newExpanded = !isExpanded;
    
    if (isControlled) {
      onToggle?.(newExpanded);
    } else {
      setInternalExpanded(newExpanded);
      onToggle?.(newExpanded);
    }
  }, [disabled, isExpanded, isControlled, onToggle]);

  return (
    <div className={cn('border-b border-gray-200 dark:border-gray-700 last:border-b-0', className)}>
      {/* Section header */}
      <Button
        variant="ghost"
        className={cn(
          'w-full justify-start h-auto p-3 rounded-none hover:bg-gray-50 dark:hover:bg-gray-800',
          disabled && 'opacity-50 cursor-not-allowed',
          headerClassName
        )}
        onClick={handleToggle}
        disabled={disabled}
        aria-expanded={isExpanded}
        aria-controls={`section-${title.toLowerCase().replace(/\s+/g, '-')}`}
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            {IconComponent && (
              <IconComponent className="h-4 w-4 text-gray-600 dark:text-gray-400" />
