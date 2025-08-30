import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Palette,
  Type,
  Layers,
  Settings,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Copy,
  Trash2,
  RotateCw,
  Move,
  Crop,
  Image as ImageIcon,
  Sticker,
  FileImage,
  Camera,
  Upload,
  ChevronDown,
  ChevronRight,
  Star,
  Heart,
  Search
} from 'lucide-react';
import { DesignElement } from '@/types/design';

interface PhotoshopPanelProps {
  designElements: DesignElement[];
  selectedElement: string | null;
  onElementUpdate: (id: string, updates: Partial<DesignElement>) => void;
  onElementDelete: (id: string) => void;
  onElementDuplicate: (id: string) => void;
  onElementVisibilityToggle: (id: string) => void;
  onAddText: (text: string, font: string, size: number, color: string) => void;
  onAddSticker: (sticker: any) => void;
  onAddTemplate: (template: any) => void;
  onImageUpload: (file: File) => void;
  selectedTshirtColor: any;
  selectedTshirtType: any;
  onTshirtColorChange: (color: any) => void;
  onTshirtTypeChange: (type: any) => void;
  tshirtColors: any[];
  tshirtTypes: any[];
  templates: any[];
  stickerPacks: any[];
}

export const PhotoshopPanel: React.FC<PhotoshopPanelProps> = ({
  designElements,
  selectedElement,
  onElementUpdate,
  onElementDelete,
  onElementDuplicate,
  onElementVisibilityToggle,
  onAddText,
  onAddSticker,
  onAddTemplate,
  onImageUpload,
  selectedTshirtColor,
  selectedTshirtType,
  onTshirtColorChange,
  onTshirtTypeChange,
  tshirtColors,
  tshirtTypes,
  templates,
  stickerPacks
}) => {
  const [activeTab, setActiveTab] = useState('layers');
  const [expandedSections, setExpandedSections] = useState<string[]>(['tshirt', 'layers']);
  const [textInput, setTextInput] = useState('');
  const [textFont, setTextFont] = useState('Arial');
  const [textSize, setTextSize] = useState(24);
  const [textColor, setTextColor] = useState('#000000');
  const [selectedStickerPack, setSelectedStickerPack] = useState(stickerPacks[0]);
  const [stickerSearch, setStickerSearch] = useState('');

  const fonts = [
    'Arial', 'Helvetica', 'Times New Roman', 'Georgia', 'Verdana',
    'Comic Sans MS', 'Impact', 'Trebuchet MS', 'Courier New'
  ];

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const selectedElementData = selectedElement 
    ? designElements.find(el => el.id === selectedElement)
    : null;

  const SectionHeader: React.FC<{ 
    title: string; 
    icon: React.ComponentType<any>; 
    section: string;
    count?: number;
  }> = ({ title, icon: Icon, section, count }) => (
    <div
      className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-800 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors border-b border-gray-200 dark:border-gray-700"
      onClick={() => toggleSection(section)}
    >
      <div className="flex items-center gap-2">
        {expandedSections.includes(section) ? (
          <ChevronDown className="h-3 w-3" />
        ) : (
          <ChevronRight className="h-3 w-3" />
        )}
        <Icon className="h-4 w-4" />
        <span className="text-sm font-medium">{title}</span>
        {count !== undefined && (
          <Badge variant="secondary" className="text-xs h-5">
