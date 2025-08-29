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
  
