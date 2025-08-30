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
            {count}
          </Badge>
        )}
      </div>
    </div>
  );

  return (
    <div className="w-80 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 flex flex-col h-screen">
      {/* Panel Header */}
      <div className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-3">
        <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
          Design Studio
        </h2>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        {[
          { id: 'layers', label: 'Layers', icon: Layers },
          { id: 'properties', label: 'Properties', icon: Settings },
          { id: 'assets', label: 'Assets', icon: ImageIcon }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-1 p-2 text-xs font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-b-2 border-blue-500'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            <tab.icon className="h-3 w-3" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Panel Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'layers' && (
          <div>
            {/* T-shirt Section */}
            <SectionHeader title="T-shirt" icon={Palette} section="tshirt" />
            {expandedSections.includes('tshirt') && (
              <div className="p-3 space-y-3 border-b border-gray-200 dark:border-gray-700">
                <div>
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Style
                  </label>
                  <div className="space-y-1">
                    {tshirtTypes.map(type => (
                      <button
                        key={type.id}
                        onClick={() => onTshirtTypeChange(type)}
                        className={`w-full p-2 rounded text-left text-xs transition-colors ${
                          selectedTshirtType.id === type.id
                            ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                            : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
