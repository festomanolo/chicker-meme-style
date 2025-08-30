# Implementation Plan

- [x] 1. Set up photorealistic mockup infrastructure and asset management
  - Create mockup asset directory structure with 1x/2x/3x resolution variants
  - Implement TshirtMockup interface and asset loading utilities
  - Create PhotorealisticMockup component with proper image handling and fallbacks
  - Write unit tests for asset loading and resolution selection
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [ ] 2. Implement core color management system
- [x] 2.1 Create color space conversion utilities
  - Write functions for RGB, HSV, HSL color space conversions
  - Implement color validation and normalization utilities
  - Create TshirtColor interface and color manipulation functions
  - Write unit tests for color conversion accuracy
  - _Requirements: 2.2, 2.3, 2.4_

- [x] 2.2 Build advanced color range selector component
  - Create ColorRangeSelector component with hue, saturation, value sliders
  - Implement numeric input fields for precise color values
  - Add 8 preset color swatches for quick selection
  - Create real-time color preview with fabric blending
  - Write tests for color selector interactions and value updates
  - _Requirements: 2.1, 2.2, 2.3, 2.5_

- [x] 2.3 Implement fabric color blending and texture system
  - Create ColorManager service for fabric color application
  - Implement GPU-accelerated color blending using CSS filters and canvas operations
  - Add texture filter options (light wash, heavy weave, heather, vintage)
  - Ensure color updates meet 120ms latency requirement
  - Write performance tests for color blending operations
  - _Requirements: 2.5, 2.6, 2.7_

- [ ] 3. Create canvas coordinate system and transform infrastructure
- [x] 3.1 Implement independent canvas coordinate system
  - Create TransformManager service with matrix-based coordinate system
  - Implement pan and zoom functionality independent of page scroll
  - Create coordinate conversion utilities between screen and canvas space
  - Write unit tests for coordinate transformations
  - _Requirements: 4.8_

- [x] 3.2 Build transform controls with live handles
  - Create TransformControls component with 8 visible handles (corners and edges)
  - Implement proportional resize by default with Shift toggle for free transform
  - Add live preview with numeric width/height readout
  - Create rotation handle with 15-degree snap functionality
  - Write tests for transform handle interactions and calculations
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [x] 3.3 Implement snapping and alignment guides
  - Create snap detection for canvas center, mockup centerline, and other elements
  - Implement temporary guide line display during drag operations
  - Add grid snapping with configurable grid size
  - Create visual feedback for snap points and alignment
  - Write tests for snap detection accuracy and guide display
  - _Requirements: 4.6, 4.7_

- [ ] 4. Build comprehensive layer management system
- [x] 4.1 Create LayerManager service and layer operations
  - Implement LayerManager with add, remove, reorder, duplicate operations
  - Create layer visibility toggle and lock functionality
  - Add layer search functionality for large inventories
  - Implement z-index management and layer ordering
  - Write unit tests for all layer operations
  - _Requirements: 6.1, 6.2, 6.3_

- [x] 4.2 Build layer panel UI component
  - Create LayersPanel component with thumbnail, name, visibility toggle, lock icon
  - Implement drag-and-drop reordering with visual feedback
  - Add inline property editing when layer is tapped
  - Create layer search input with real-time filtering
  - Write tests for layer panel interactions and state updates
  - _Requirements: 6.4, 6.5_

- [ ] 5. Implement advanced cropping system
- [x] 5.1 Create non-destructive cropping functionality
  - Build CropTool component with mask overlay and draggable crop rectangle
  - Implement confirm/cancel buttons for crop operations
  - Create non-destructive cropping that preserves original image data
  - Add crop reset functionality to restore original image
  - Write tests for crop operations and data preservation
  - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [x] 5.2 Integrate cropping with transform system
  - Connect crop tool with transform controls for seamless workflow
  - Implement crop preview in properties panel
  - Add crop bounds validation and constraint handling
  - Create smooth transitions between crop and transform modes
  - Write integration tests for crop and transform interactions
  - _Requirements: 5.1, 5.4_

- [ ] 6. Build history and undo system
- [x] 6.1 Create HistoryManager service
  - Implement HistoryManager with 50-entry maximum stack
