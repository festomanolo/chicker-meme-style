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
