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
                        <div className="flex items-center gap-2">
                          <span>{type.icon}</span>
                          <div>
                            <div className="font-medium">{type.name}</div>
                            <div className="text-gray-500">TZS {type.price.toLocaleString()}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Color
                  </label>
                  <div className="grid grid-cols-6 gap-1">
                    {tshirtColors.map(color => (
                      <button
                        key={color.name}
                        onClick={() => onTshirtColorChange(color)}
                        className={`w-8 h-8 rounded border-2 transition-all ${
                          selectedTshirtColor.name === color.name
                            ? 'border-blue-500 ring-2 ring-blue-200'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Layers Section */}
            <SectionHeader 
              title="Layers" 
              icon={Layers} 
              section="layers" 
              count={designElements.length}
            />
            {expandedSections.includes('layers') && (
              <div className="border-b border-gray-200 dark:border-gray-700">
                {designElements.length === 0 ? (
                  <div className="p-4 text-center text-xs text-gray-500">
                    No layers yet
                  </div>
                ) : (
                  <div className="max-h-64 overflow-y-auto">
                    {designElements.slice().reverse().map(element => (
                      <div
                        key={element.id}
                        className={`flex items-center gap-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors ${
                          selectedElement === element.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                        }`}
                      >
                        <button
                          onClick={() => onElementVisibilityToggle(element.id)}
                          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                        >
                          {element.visible ? (
                            <Eye className="h-3 w-3" />
                          ) : (
                            <EyeOff className="h-3 w-3 text-gray-400" />
                          )}
                        </button>
                        
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-medium truncate">
                            {element.type === 'text' && `Text: ${element.content?.substring(0, 15)}...`}
                            {element.type === 'image' && 'Image'}
                            {element.type === 'template' && `Template: ${element.template?.name}`}
                          </div>
                        </div>
                        
                        <div className="flex gap-1">
                          <button
                            onClick={() => onElementDuplicate(element.id)}
                            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                          >
                            <Copy className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => onElementDelete(element.id)}
                            className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded text-red-600"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'properties' && (
          <div className="p-3">
            {selectedElementData ? (
              <div className="space-y-4">
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Element Properties
                </div>
                
                {/* Transform */}
                <div className="space-y-3">
                  <div className="text-xs font-medium text-gray-600 dark:text-gray-400">Transform</div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-gray-500">X</label>
                      <Input
                        type="number"
                        value={selectedElementData.x}
                        onChange={(e) => onElementUpdate(selectedElementData.id, { x: Number(e.target.value) })}
                        className="h-7 text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Y</label>
                      <Input
                        type="number"
                        value={selectedElementData.y}
                        onChange={(e) => onElementUpdate(selectedElementData.id, { y: Number(e.target.value) })}
                        className="h-7 text-xs"
                      />
                    </div>
                  </div>
                  
                  {(selectedElementData.type === 'image' || selectedElementData.type === 'template') && (
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs text-gray-500">Width</label>
                        <Input
                          type="number"
                          value={selectedElementData.width || 100}
                          onChange={(e) => onElementUpdate(selectedElementData.id, { width: Number(e.target.value) })}
                          className="h-7 text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Height</label>
                        <Input
                          type="number"
                          value={selectedElementData.height || 100}
                          onChange={(e) => onElementUpdate(selectedElementData.id, { height: Number(e.target.value) })}
                          className="h-7 text-xs"
                        />
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">
                      Rotation: {selectedElementData.rotation}°
                    </label>
                    <Slider
                      value={[selectedElementData.rotation]}
                      onValueChange={([value]) => onElementUpdate(selectedElementData.id, { rotation: value })}
                      min={0}
                      max={360}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">
                      Opacity: {Math.round(selectedElementData.opacity * 100)}%
                    </label>
                    <Slider
                      value={[selectedElementData.opacity]}
                      onValueChange={([value]) => onElementUpdate(selectedElementData.id, { opacity: value })}
                      min={0}
                      max={1}
                      step={0.01}
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Text Properties */}
                {selectedElementData.type === 'text' && (
                  <div className="space-y-3">
                    <div className="text-xs font-medium text-gray-600 dark:text-gray-400">Text</div>
                    
                    <Textarea
                      value={selectedElementData.content || ''}
                      onChange={(e) => onElementUpdate(selectedElementData.id, { content: e.target.value })}
                      className="text-xs"
                      rows={2}
                    />
                    
                    <select
                      value={selectedElementData.font || 'Arial'}
                      onChange={(e) => onElementUpdate(selectedElementData.id, { font: e.target.value })}
                      className="w-full text-xs p-2 border rounded"
                    >
                      {fonts.map(font => (
                        <option key={font} value={font}>{font}</option>
                      ))}
                    </select>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs text-gray-500">Size</label>
                        <Input
                          type="number"
                          value={selectedElementData.size || 24}
                          onChange={(e) => onElementUpdate(selectedElementData.id, { size: Number(e.target.value) })}
                          className="h-7 text-xs"
                          min="8"
                          max="72"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Color</label>
                        <Input
                          type="color"
                          value={selectedElementData.color || '#000000'}
                          onChange={(e) => onElementUpdate(selectedElementData.id, { color: e.target.value })}
                          className="h-7"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Lock */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600 dark:text-gray-400">Locked</span>
                  <Switch
                    checked={selectedElementData.locked}
                    onCheckedChange={(checked) => onElementUpdate(selectedElementData.id, { locked: checked })}
                  />
                </div>
              </div>
            ) : (
              <div className="text-center text-xs text-gray-500 py-8">
                Select an element to edit properties
              </div>
            )}
          </div>
        )}

        {activeTab === 'assets' && (
          <div>
            {/* Text Tool */}
            <SectionHeader title="Text" icon={Type} section="text" />
            {expandedSections.includes('text') && (
              <div className="p-3 space-y-3 border-b border-gray-200 dark:border-gray-700">
                <Textarea
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Enter text..."
                  className="text-xs"
                  rows={2}
                />
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={textFont}
                    onChange={(e) => setTextFont(e.target.value)}
                    className="text-xs p-2 border rounded"
                  >
                    {fonts.map(font => (
                      <option key={font} value={font}>{font}</option>
                    ))}
                  </select>
                  <Input
                    type="number"
                    value={textSize}
                    onChange={(e) => setTextSize(Number(e.target.value))}
                    className="h-8 text-xs"
                    min="8"
                    max="72"
                  />
                </div>
                <Input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="h-8"
                />
                <Button
                  onClick={() => {
                    if (textInput.trim()) {
                      onAddText(textInput, textFont, textSize, textColor);
                      setTextInput('');
                    }
                  }}
                  className="w-full h-8 text-xs"
                  disabled={!textInput.trim()}
                >
                  Add Text
                </Button>
              </div>
            )}

            {/* Stickers */}
            <SectionHeader title="Stickers" icon={Sticker} section="stickers" />
            {expandedSections.includes('stickers') && (
              <div className="p-3 space-y-3 border-b border-gray-200 dark:border-gray-700">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
                  <Input
                    placeholder="Search stickers..."
                    value={stickerSearch}
                    onChange={(e) => setStickerSearch(e.target.value)}
                    className="pl-7 h-7 text-xs"
                  />
                </div>
                
                <div className="flex gap-1 overflow-x-auto">
                  {stickerPacks.map(pack => (
                    <button
                      key={pack.id}
                      onClick={() => setSelectedStickerPack(pack)}
                      className={`flex-shrink-0 px-2 py-1 rounded text-xs ${
                        selectedStickerPack.id === pack.id
                          ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600'
                          : 'bg-gray-100 dark:bg-gray-800'
                      }`}
                    >
                      {pack.icon}
                    </button>
                  ))}
                </div>
                
                <div className="grid grid-cols-6 gap-1 max-h-32 overflow-y-auto">
                  {selectedStickerPack.stickers
                    .filter(sticker => 
                      stickerSearch === '' || 
                      sticker.name.toLowerCase().includes(stickerSearch.toLowerCase())
                    )
                    .map(sticker => (
                      <button
                        key={sticker.id}
                        onClick={() => onAddSticker(sticker)}
                        className="aspect-square p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-lg"
                        title={sticker.name}
                      >
                        {sticker.emoji}
                      </button>
                    ))}
                </div>
              </div>
            )}

            {/* Templates */}
            <SectionHeader title="Templates" icon={ImageIcon} section="templates" />
            {expandedSections.includes('templates') && (
              <div className="p-3 space-y-2 border-b border-gray-200 dark:border-gray-700">
                {templates.map(template => (
                  <button
                    key={template.id}
                    onClick={() => onAddTemplate(template)}
                    className="w-full p-2 rounded text-left text-xs hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{template.preview}</span>
