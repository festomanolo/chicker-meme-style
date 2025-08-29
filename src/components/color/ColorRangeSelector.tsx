// Advanced color range selector component
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { TshirtColor, ColorPreset } from '@/types/color';
import { ColorConverter, ColorValidator, createTshirtColorFromHsv } from '@/lib/color-utils';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Palette, Pipette, RotateCcw } from 'lucide-react';

interface ColorRangeSelectorProps {
  selectedColor: TshirtColor;
  onColorChange: (color: TshirtColor) => void;
  presetColors?: ColorPreset[];
  className?: string;
  showPreview?: boolean;
  disabled?: boolean;
  onColorValidation?: (isValid: boolean, errors: string[]) => void;
}

// Default preset colors
const DEFAULT_PRESET_COLORS: ColorPreset[] = [
  { id: 'white', name: 'White', color: ColorConverter.createTshirtColor(255, 255, 255, 'White'), category: 'basic' },
  { id: 'black', name: 'Black', color: ColorConverter.createTshirtColor(0, 0, 0, 'Black'), category: 'basic' },
  { id: 'red', name: 'Red', color: ColorConverter.createTshirtColor(239, 68, 68, 'Red'), category: 'basic' },
  { id: 'blue', name: 'Blue', color: ColorConverter.createTshirtColor(59, 130, 246, 'Blue'), category: 'basic' },
  { id: 'green', name: 'Green', color: ColorConverter.createTshirtColor(34, 197, 94, 'Green'), category: 'basic' },
  { id: 'yellow', name: 'Yellow', color: ColorConverter.createTshirtColor(245, 158, 11, 'Yellow'), category: 'basic' },
  { id: 'purple', name: 'Purple', color: ColorConverter.createTshirtColor(168, 85, 247, 'Purple'), category: 'basic' },
  { id: 'gray', name: 'Gray', color: ColorConverter.createTshirtColor(107, 114, 128, 'Gray'), category: 'basic' },
];

export const ColorRangeSelector: React.FC<ColorRangeSelectorProps> = ({
  selectedColor,
  onColorChange,
  presetColors = DEFAULT_PRESET_COLORS,
  className,
  showPreview = true,
  disabled = false,
  onColorValidation,
}) => {
  const [activeTab, setActiveTab] = useState<'presets' | 'advanced'>('presets');
  const [hue, setHue] = useState(selectedColor.h);
  const [saturation, setSaturation] = useState(selectedColor.s);
  const [value, setValue] = useState(selectedColor.v);
  const [hexInput, setHexInput] = useState(selectedColor.hex);
  const [rgbInput, setRgbInput] = useState({
    r: selectedColor.r,
    g: selectedColor.g,
    b: selectedColor.b,
  });

  // Update internal state when selectedColor changes
  useEffect(() => {
