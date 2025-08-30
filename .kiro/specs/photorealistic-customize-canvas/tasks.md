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
  - Create state serialization and deserialization utilities
  - Add undo/redo functionality with proper state restoration
  - Implement history compression for memory efficiency
  - Write unit tests for history operations and state management
  - _Requirements: 5.5, 8.4_

- [x] 6.2 Integrate history with all canvas operations
  - Connect history saving to all element modifications
  - Implement automatic history snapshots on operation completion
  - Add keyboard shortcuts for undo/redo (Ctrl+Z, Ctrl+Y)
  - Create history state validation and error recovery
  - Write integration tests for history across all operations
  - _Requirements: 5.5, 5.6_

- [ ] 7. Create mobile-optimized editing panel
- [x] 7.1 Build responsive panel infrastructure
  - Create MobileEditingPanel component with slide-over behavior
  - Implement panel width calculations (42% viewport, 260px min, 420px max)
  - Add full-height 75% width mode for small phones
  - Create smooth panel expand/collapse animations
  - Write tests for panel responsive behavior across screen sizes
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 7.2 Implement Photoshop-like tool organization
  - Create tools row with Move, Crop, Text, Image Replace, Mask, Pen, Eyedropper icons
  - Implement 44px touch targets for all tool icons
  - Build collapsible sections for Layers, Properties, Quick Actions
  - Add context-sensitive properties panel that updates based on selection
  - Write tests for tool switching and panel section interactions
  - _Requirements: 3.6, 3.7_

- [x] 7.3 Optimize canvas behavior with panel interactions
  - Implement canvas shrinking when panel is open while maintaining zoom/pan
  - Create quick collapse button for panel
  - Add smooth transitions between panel states
  - Ensure canvas remains functional during panel animations
  - Write tests for canvas-panel interaction behavior
  - _Requirements: 3.5, 3.8_

- [ ] 8. Implement WhatsApp notification system
- [x] 8.1 Create notification component and timing logic
  - Build WhatsAppNotification component with macOS-style design
  - Implement 2-minute interval timing with user activity detection
  - Create dismissal logic with 20-minute cooldown
  - Add page exclusion logic for Settings and More pages
  - Write unit tests for notification timing and dismissal behavior
  - _Requirements: 7.1, 7.2, 7.6, 7.7, 7.8_

- [x] 8.2 Implement WhatsApp integration and analytics
  - Create WhatsApp link generation with wa.me format
  - Add configurable phone number and default message settings
  - Implement analytics tracking for show, click, dismiss, and link opened events
  - Create notification state persistence across sessions
  - Write tests for WhatsApp link generation and analytics events
  - _Requirements: 7.3, 7.4, 7.5, 9.1, 9.2_

- [ ] 9. Add keyboard navigation and accessibility features
- [ ] 9.1 Implement comprehensive keyboard support
  - Add Tab order navigation for all interactive controls
  - Implement arrow key nudging (1px default, 10px with Shift)
  - Create Enter to confirm and Esc to cancel functionality
  - Add focus indicators and keyboard shortcuts
  - Write tests for keyboard navigation and shortcuts
  - _Requirements: 5.6, 8.1, 8.2_

- [ ] 9.2 Add accessibility labels and ARIA support
  - Implement aria-label and role attributes for all interactive elements
  - Create screen reader support for canvas elements and operations
  - Add high contrast mode support and focus indicators
  - Implement accessible error messages and status updates
  - Write accessibility tests using automated testing tools
  - _Requirements: 8.1, 8.2_

- [ ] 10. Implement performance optimizations and GPU acceleration
- [ ] 10.1 Add GPU acceleration for transforms and blending
  - Implement CSS transform3d for hardware acceleration
  - Use GPU-accelerated canvas operations for color blending
  - Add WebGL fallbacks for complex operations
  - Optimize render loops to maintain 60fps target
  - Write performance tests to validate 60ms repaint requirement
  - _Requirements: 8.5, 8.6_

- [ ] 10.2 Implement image optimization and lazy loading
  - Create image format detection and WebP conversion
  - Add lazy loading for mockup assets and design elements
  - Implement progressive image loading with quality tiers
  - Create memory management for large image operations
  - Write tests for image optimization and loading performance
  - _Requirements: 8.6_

- [ ] 11. Add analytics integration and state management APIs
- [ ] 11.1 Create comprehensive analytics tracking
  - Implement event tracking for all user interactions
