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
