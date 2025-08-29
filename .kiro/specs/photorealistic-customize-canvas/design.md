# Design Document

## Overview

This design document outlines the architecture and implementation approach for the photorealistic customize canvas feature. The system will replace the current vector-based t-shirt mockups with photorealistic images, implement advanced color selection with real-time fabric rendering, provide a mobile-optimized Photoshop-like interface, and include precise canvas interactions with comprehensive layer management.

The design leverages modern web technologies including Canvas API, CSS transforms, GPU acceleration, and responsive design patterns to deliver a professional-grade editing experience optimized for both desktop and mobile devices.

## Architecture

### High-Level System Architecture

```mermaid
graph TB
    UI[User Interface Layer] --> SM[State Management]
    UI --> CI[Canvas Interaction Engine]
    UI --> NM[Notification Manager]
    
    SM --> PS[Persistent Storage]
    SM --> AS[Analytics Service]
    
    CI --> TM[Transform Manager]
    CI --> CM[Color Manager]
    CI --> LM[Layer Manager]
    CI --> HM[History Manager]
    
    TM --> GPU[GPU Acceleration]
    CM --> GPU
    
    AM[Asset Manager] --> CI
    AM --> CM
    
    subgraph "Core Services"
        TM
        CM
        LM
        HM
        AM
    end
    
    subgraph "External Integrations"
        WA[WhatsApp Integration]
        AS
        PS
    end
```

### Component Architecture

The system follows a modular component architecture with clear separation of concerns:

1. **Presentation Layer**: React components for UI rendering
2. **Business Logic Layer**: Custom hooks and services for feature logic
3. **Data Layer**: State management and persistence
4. **Integration Layer**: External service integrations

## Components and Interfaces

### Core Components

#### 1. PhotorealisticCanvas Component

```typescript
interface PhotorealisticCanvasProps {
  selectedMockup: TshirtMockup;
  selectedColor: TshirtColor;
  designElements: DesignElement[];
  selectedElementId: string | null;
  canvasZoom: number;
  onElementSelect: (elementId: string | null) => void;
  onElementUpdate: (elementId: string, updates: Partial<DesignElement>) => void;
  onElementAdd: (element: DesignElement) => void;
  onElementDelete: (elementId: string) => void;
}

interface TshirtMockup {
  id: string;
  name: string;
  type: 'front' | 'back';
  variants: {
    '1x': string;
    '2x': string;
    '3x': string;
  };
  maskUrl: string;
  designArea: {
    x: number;
    y: number;
    width: number;
    height: number;
    curvature: BezierPath;
  };
}
```

#### 2. ColorRangeSelector Component

```typescript
interface ColorRangeSelectorProps {
  selectedColor: TshirtColor;
  onColorChange: (color: TshirtColor) => void;
  presetColors: TshirtColor[];
  textureFilters: TextureFilter[];
  onTextureChange: (filter: TextureFilter) => void;
}

interface TshirtColor {
  h: number; // 0-360
  s: number; // 0-100
  v: number; // 0-100
  r: number; // 0-255
  g: number; // 0-255
  b: number; // 0-255
  hex: string;
  name?: string;
}

interface TextureFilter {
  id: string;
  name: string;
  shader: string;
  preview: string;
}
```

#### 3. MobileEditingPanel Component

```typescript
interface MobileEditingPanelProps {
  isOpen: boolean;
  onToggle: () => void;
  selectedTool: EditingTool;
  onToolChange: (tool: EditingTool) => void;
  layers: DesignElement[];
  selectedElementId: string | null;
  onLayerSelect: (elementId: string) => void;
  onLayerReorder: (fromIndex: number, toIndex: number) => void;
  properties: ElementProperties;
  onPropertyChange: (property: string, value: any) => void;
}

type EditingTool = 'move' | 'crop' | 'text' | 'image' | 'mask' | 'pen' | 'eyedropper';
```

#### 4. TransformControls Component

```typescript
interface TransformControlsProps {
  element: DesignElement;
  isSelected: boolean;
  onTransform: (transform: TransformData) => void;
  onTransformEnd: () => void;
  canvasRect: DOMRect;
  zoom: number;
}

interface TransformData {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
}
```

#### 5. WhatsAppNotification Component

```typescript
interface WhatsAppNotificationProps {
  isVisible: boolean;
  onDismiss: () => void;
  onWhatsAppClick: () => void;
  config: NotificationConfig;
}

interface NotificationConfig {
  phoneNumber: string;
  defaultMessage: string;
  cooldownMinutes: number;
  intervalMinutes: number;
  excludedPages: string[];
}
```

### Service Interfaces

#### 1. Transform Manager

```typescript
interface TransformManager {
  applyTransform(elementId: string, transform: TransformData): void;
  getTransformMatrix(element: DesignElement): DOMMatrix;
  snapToGuides(position: Point, threshold: number): Point;
  getSnapGuides(element: DesignElement, allElements: DesignElement[]): SnapGuide[];
  validateBounds(element: DesignElement, canvasBounds: Rect): DesignElement;
}

interface SnapGuide {
  type: 'center' | 'edge' | 'element' | 'grid';
  position: number;
  axis: 'x' | 'y';
  temporary: boolean;
}
```

#### 2. Color Manager

```typescript
interface ColorManager {
  applyColorToFabric(color: TshirtColor, mockup: TshirtMockup): Promise<string>;
  convertColorSpace(color: any, from: ColorSpace, to: ColorSpace): any;
  generateColorPreview(color: TshirtColor, texture: TextureFilter): string;
  blendColorWithFabric(color: TshirtColor, fabricBase: string): string;
}

type ColorSpace = 'rgb' | 'hsv' | 'hsl' | 'lab';
```

#### 3. Layer Manager

```typescript
interface LayerManager {
  addLayer(element: DesignElement): void;
