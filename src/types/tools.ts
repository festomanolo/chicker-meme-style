// Tool system type definitions
export type ToolType = 
  | 'move'
  | 'crop' 
  | 'text'
  | 'image'
  | 'mask'
  | 'pen'
  | 'eyedropper'
  | 'zoom'
  | 'hand';

export interface Tool {
  id: ToolType;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  shortcut?: string;
  description: string;
  category: 'selection' | 'drawing' | 'editing' | 'navigation';
  isActive?: boolean;
  isDisabled?: boolean;
}

export interface ToolGroup {
  id: string;
  name: string;
  tools: Tool[];
  isExpanded?: boolean;
}

export interface ToolbarConfig {
  showLabels?: boolean;
  showShortcuts?: boolean;
  iconSize?: 'sm' | 'md' | 'lg';
  orientation?: 'horizontal' | 'vertical';
  grouping?: 'none' | 'category' | 'custom';
}

export interface PanelSection {
  id: string;
  title: string;
  icon?: React.ComponentType<{ className?: string }>;
  isCollapsible: boolean;
  isExpanded: boolean;
  content: React.ReactNode;
  order: number;
}

export interface PropertyPanelConfig {
  selectedTool: ToolType | null;
  selectedElement: string | null;
  availableSections: PanelSection[];
  contextSensitive: boolean;
}