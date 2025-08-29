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
    setHue(selectedColor.h);
    setSaturation(selectedColor.s);
    setValue(selectedColor.v);
    setHexInput(selectedColor.hex);
    setRgbInput({
      r: selectedColor.r,
      g: selectedColor.g,
      b: selectedColor.b,
    });
  }, [selectedColor]);

  // Create color from HSV values
  const currentColor = useMemo(() => {
    return createTshirtColorFromHsv(hue, saturation, value);
  }, [hue, saturation, value]);

  // Validate current color and notify parent
  useEffect(() => {
    const validation = ColorValidator.validateTshirtColor(currentColor);
    onColorValidation?.(validation.isValid, validation.errors);
  }, [currentColor, onColorValidation]);

  // Handle HSV slider changes
  const handleHueChange = useCallback((values: number[]) => {
    const newHue = values[0];
    setHue(newHue);
    const newColor = createTshirtColorFromHsv(newHue, saturation, value);
    onColorChange(newColor);
  }, [saturation, value, onColorChange]);

  const handleSaturationChange = useCallback((values: number[]) => {
    const newSaturation = values[0];
    setSaturation(newSaturation);
    const newColor = createTshirtColorFromHsv(hue, newSaturation, value);
    onColorChange(newColor);
  }, [hue, value, onColorChange]);

  const handleValueChange = useCallback((values: number[]) => {
    const newValue = values[0];
    setValue(newValue);
    const newColor = createTshirtColorFromHsv(hue, saturation, newValue);
    onColorChange(newColor);
  }, [hue, saturation, onColorChange]);

  // Handle hex input change
  const handleHexInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const hex = e.target.value;
    setHexInput(hex);

    if (ColorValidator.validateHexColor(hex)) {
      const color = ColorConverter.createTshirtColorFromHex(hex);
      if (color) {
        setHue(color.h);
        setSaturation(color.s);
        setValue(color.v);
        setRgbInput({ r: color.r, g: color.g, b: color.b });
        onColorChange(color);
      }
    }
  }, [onColorChange]);

  // Handle RGB input changes
  const handleRgbInputChange = useCallback((component: 'r' | 'g' | 'b', value: string) => {
    const numValue = parseInt(value) || 0;
    const clampedValue = Math.max(0, Math.min(255, numValue));
    
    const newRgbInput = { ...rgbInput, [component]: clampedValue };
    setRgbInput(newRgbInput);

    if (ColorValidator.validateRgbValues(newRgbInput.r, newRgbInput.g, newRgbInput.b)) {
      const color = ColorConverter.createTshirtColor(newRgbInput.r, newRgbInput.g, newRgbInput.b);
      setHue(color.h);
      setSaturation(color.s);
      setValue(color.v);
      setHexInput(color.hex);
      onColorChange(color);
    }
  }, [rgbInput, onColorChange]);

  // Handle preset color selection
  const handlePresetColorSelect = useCallback((preset: ColorPreset) => {
    const color = preset.color;
    setHue(color.h);
    setSaturation(color.s);
    setValue(color.v);
    setHexInput(color.hex);
    setRgbInput({ r: color.r, g: color.g, b: color.b });
    onColorChange(color);
  }, [onColorChange]);

  // Reset to original color
  const handleReset = useCallback(() => {
    setHue(selectedColor.h);
    setSaturation(selectedColor.s);
    setValue(selectedColor.v);
    setHexInput(selectedColor.hex);
    setRgbInput({
      r: selectedColor.r,
      g: selectedColor.g,
      b: selectedColor.b,
    });
  }, [selectedColor]);

  // Generate hue gradient for slider background
  const hueGradient = useMemo(() => {
    const stops = [];
    for (let i = 0; i <= 360; i += 30) {
      const color = ColorConverter.hsvToRgb(i, 100, 100);
      stops.push(`rgb(${color.r}, ${color.g}, ${color.b})`);
    }
    return `linear-gradient(to right, ${stops.join(', ')})`;
  }, []);

  // Generate saturation gradient for slider background
  const saturationGradient = useMemo(() => {
    const colorStart = ColorConverter.hsvToRgb(hue, 0, value);
    const colorEnd = ColorConverter.hsvToRgb(hue, 100, value);
    return `linear-gradient(to right, rgb(${colorStart.r}, ${colorStart.g}, ${colorStart.b}), rgb(${colorEnd.r}, ${colorEnd.g}, ${colorEnd.b}))`;
  }, [hue, value]);

  // Generate value gradient for slider background
  const valueGradient = useMemo(() => {
    const colorStart = ColorConverter.hsvToRgb(hue, saturation, 0);
    const colorEnd = ColorConverter.hsvToRgb(hue, saturation, 100);
    return `linear-gradient(to right, rgb(${colorStart.r}, ${colorStart.g}, ${colorStart.b}), rgb(${colorEnd.r}, ${colorEnd.g}, ${colorEnd.b}))`;
  }, [hue, saturation]);

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Palette className="h-5 w-5" />
          Color Selection
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Color Preview */}
        {showPreview && (
          <div className="flex items-center gap-3">
            <div
              className="w-16 h-16 rounded-lg border-2 border-gray-200 shadow-sm"
              style={{ backgroundColor: currentColor.hex }}
              aria-label={`Selected color: ${currentColor.hex}`}
            />
            <div className="flex-1">
              <p className="text-sm font-medium">{currentColor.name || 'Custom Color'}</p>
              <p className="text-xs text-muted-foreground">{currentColor.hex}</p>
              <p className="text-xs text-muted-foreground">
                HSV({currentColor.h}, {currentColor.s}%, {currentColor.v}%)
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              disabled={disabled}
              className="shrink-0"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Color Selection Tabs */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="presets">Presets</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          {/* Preset Colors Tab */}
          <TabsContent value="presets" className="space-y-4">
            <div className="grid grid-cols-4 gap-2">
              {presetColors.map((preset) => (
                <Button
                  key={preset.id}
                  variant="outline"
                  className={cn(
                    "h-12 p-1 relative overflow-hidden",
                    selectedColor.hex === preset.color.hex && "ring-2 ring-primary"
                  )}
                  onClick={() => handlePresetColorSelect(preset)}
                  disabled={disabled}
                  aria-label={`Select ${preset.name} color`}
                >
                  <div
                    className="w-full h-full rounded-sm"
                    style={{ backgroundColor: preset.color.hex }}
                  />
                  <Badge
                    variant="secondary"
                    className="absolute bottom-0 left-0 right-0 text-xs py-0 rounded-none rounded-b-sm"
                  >
                    {preset.name}
                  </Badge>
                </Button>
              ))}
            </div>
          </TabsContent>

          {/* Advanced Color Selection Tab */}
          <TabsContent value="advanced" className="space-y-6">
            {/* HSV Sliders */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="hue-slider" className="text-sm font-medium">
                  Hue: {hue}°
                </Label>
                <div className="relative">
                  <Slider
                    id="hue-slider"
                    min={0}
                    max={360}
                    step={1}
                    value={[hue]}
                    onValueChange={handleHueChange}
                    disabled={disabled}
                    className="w-full"
                    style={{
                      background: hueGradient,
                    }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="saturation-slider" className="text-sm font-medium">
                  Saturation: {saturation}%
                </Label>
                <div className="relative">
                  <Slider
                    id="saturation-slider"
                    min={0}
