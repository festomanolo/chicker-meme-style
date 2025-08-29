# Requirements Document

## Introduction

This feature specification outlines the complete rewrite and enhancement of the customize canvas page to replace stylized t-shirt vectors with photorealistic t-shirt images, provide full color-range selection for garments, and add Photoshop-like mobile editing capabilities with optimized use of limited screen space. The implementation will include precise interaction features such as drag-resize with live handles, cropping, transform controls, and a timed in-app notification element that links to WhatsApp.

## Requirements

### Requirement 1: Photorealistic T-Shirt Mockups

**User Story:** As a user designing custom t-shirts, I want to see photorealistic mockups instead of vector art, so that I can better visualize how my design will look on an actual garment.

#### Acceptance Criteria

1. WHEN the customize page loads THEN the system SHALL display photorealistic t-shirt mockups with realistic folds, shadows, and fabric texture
2. WHEN a user selects a t-shirt type THEN the system SHALL show both front and back mockup variants
3. WHEN displaying mockups THEN each mockup SHALL be a high resolution PNG or WebP with an alpha mask that defines the design area
4. WHEN the design area is displayed THEN the mask SHALL follow the natural chest curvature within 6 pixels at 100% zoom
5. WHEN mockups are loaded THEN the system SHALL provide 1x, 2x, and 3x resolution variants for different screen densities

### Requirement 2: Advanced Color Range Selection

**User Story:** As a user customizing t-shirt colors, I want precise color control with real-time fabric preview, so that I can achieve the exact color I envision for my design.

#### Acceptance Criteria

1. WHEN selecting t-shirt colors THEN the system SHALL provide 8 quick-preset color swatches for immediate selection
2. WHEN using advanced color selection THEN the system SHALL provide hue, saturation, and brightness/value sliders
3. WHEN adjusting color controls THEN the system SHALL provide numeric inputs for H, S, V or RGB values
4. WHEN color changes are made THEN the fabric appearance SHALL update in real time with no more than 120ms latency
5. WHEN applying colors THEN the system SHALL use color-blend layers to maintain realistic lighting on fabric
6. WHEN texture filters are available THEN the system SHALL provide options for light wash, heavy weave, heather, and vintage effects
7. WHEN texture filters are applied THEN the system SHALL use GPU-accelerated CSS shaders or canvas blend modes

### Requirement 3: Mobile-Optimized Photoshop-Like Interface

**User Story:** As a mobile user editing designs, I want a Photoshop-like interface that maximizes screen space usage, so that I can efficiently access all editing tools without compromising the canvas view.

#### Acceptance Criteria

1. WHEN on mobile devices THEN the right panel SHALL be positioned at the right edge as an overlay panel
2. WHEN the panel is collapsed THEN it SHALL show as an icon and expand with a single tap
3. WHEN the panel is expanded THEN it SHALL be 42% of viewport width or minimum 260px, maximum 420px on tablets
4. WHEN on small phones THEN the panel SHALL be full height and 75% width
5. WHEN the panel is open THEN the canvas SHALL shrink but maintain zoom and pan functionality
6. WHEN organizing panel content THEN the system SHALL group tools in sections: Tools row (top), Layers (middle), Properties (context-sensitive), Quick Actions (bottom)
7. WHEN displaying tool icons THEN each icon SHALL have 44px touch targets for accessibility

### Requirement 4: Precise Canvas Interactions

**User Story:** As a user editing designs on the canvas, I want precise drag-resize controls with live feedback, so that I can position and size elements exactly as intended.

#### Acceptance Criteria

1. WHEN clicking or tapping an element THEN the system SHALL show 8 visible transform handles (corners and edges)
2. WHEN dragging corner handles THEN the system SHALL resize proportionally by default
3. WHEN holding Shift during resize THEN the system SHALL toggle free transform mode
4. WHEN resizing elements THEN the system SHALL show live preview with numeric width/height readout
5. WHEN rotating elements THEN the system SHALL show rotation handle above selection with snap to 15-degree increments
6. WHEN dragging elements THEN the system SHALL provide snapping to canvas center, mockup centerline, other elements, and grid lines
7. WHEN snapping occurs THEN the system SHALL show temporary guide lines during drag operations
8. WHEN interacting with canvas THEN the coordinate system SHALL be independent of page scroll using internal transform matrix

### Requirement 5: Advanced Cropping and Transform Controls

**User Story:** As a user working with images, I want non-destructive cropping tools with precise controls, so that I can adjust image composition without losing original data.

#### Acceptance Criteria

1. WHEN using the crop tool THEN the system SHALL show mask overlay with draggable crop rectangle
2. WHEN cropping is active THEN the system SHALL provide confirm/cancel buttons
3. WHEN cropping is applied THEN the operation SHALL be non-destructive, preserving original image data in element metadata
4. WHEN cropping is complete THEN the user SHALL be able to reset to original image
5. WHEN transform controls are used THEN all actions SHALL be undoable and recorded in history stack with maximum 50 entries
6. WHEN using keyboard shortcuts THEN the system SHALL support Tab order, Enter to confirm, Esc to cancel, arrow keys to nudge by 1px, Shift+arrow to nudge by 10px

### Requirement 6: Layer Management System

**User Story:** As a user with multiple design elements, I want comprehensive layer management, so that I can organize and control the visibility and order of my design components.

#### Acceptance Criteria

1. WHEN managing layers THEN the system SHALL support bring forward, send back, lock, hide, duplicate, and delete operations
2. WHEN displaying layers THEN the list SHALL show thumbnail, name, visibility toggle, lock icon, and re-order handle
3. WHEN working with many layers THEN the layers list SHALL be searchable
4. WHEN tapping a layer THEN properties SHALL be revealed inline instead of opening a modal
5. WHEN reordering layers THEN the system SHALL provide drag-and-drop functionality with visual feedback

### Requirement 7: Timed WhatsApp Notification System

**User Story:** As a business owner, I want to periodically prompt users to contact us via WhatsApp, so that I can provide personalized assistance and increase customer engagement.

#### Acceptance Criteria

1. WHEN users are active on any page THEN the notification SHALL appear as a dropdown from the top every 2 minutes
2. WHEN the notification appears THEN it SHALL use macOS-style horizontal rounded capsule design with semi-translucent backdrop
3. WHEN displaying notification content THEN it SHALL show static text: "Share to us what vibe you want to express and we will respond as quick as possible on WhatsApp"
4. WHEN notification is shown THEN it SHALL include a primary CTA button labeled "Message us on WhatsApp" and a close icon
5. WHEN CTA is clicked THEN it SHALL open WhatsApp using canonical wa.me format in new tab
6. WHEN notification is dismissed THEN it SHALL not show again for current session until configurable cooldown (default 20 minutes)
7. WHEN on Settings or More pages THEN the notification SHALL NOT be displayed
8. WHEN in full screen editing mode THEN notification SHALL show only as subtle toast unless side panels are open

### Requirement 8: Performance and Accessibility

**User Story:** As a user with accessibility needs or on lower-end devices, I want the interface to be performant and accessible, so that I can use all features regardless of my capabilities or device limitations.

#### Acceptance Criteria

1. WHEN using interactive controls THEN all elements SHALL have aria-label and appropriate roles
2. WHEN navigating with keyboard THEN the system SHALL provide logical tab order and focus indicators
3. WHEN performing canvas operations THEN the system SHALL maintain under 60ms repaint per interaction for target devices
4. WHEN loading images THEN the system SHALL provide lazy loading and hiDPI support
5. WHEN using transforms and blending THEN operations SHALL be GPU-accelerated where possible
6. WHEN uploading images THEN the system SHALL accept PNG, JPG, WebP, HEIC formats and convert to optimized WebP for canvas rendering

### Requirement 9: Analytics and State Management

**User Story:** As a product manager, I want comprehensive analytics on user interactions, so that I can understand usage patterns and optimize the user experience.

#### Acceptance Criteria

1. WHEN notification events occur THEN the system SHALL fire analytics events for show, click CTA, dismissed, and link opened
2. WHEN canvas interactions happen THEN the system SHALL track onElementChanged, onTshirtColorChanged, onNotificationAction, and onWhatsAppClick events
3. WHEN managing application state THEN the system SHALL maintain selectedTshirtMockup, selectedTshirtColor, designElements, selectedElementId, canvasZoom, and notificationState
4. WHEN state changes occur THEN the system SHALL provide APIs for external integration and monitoring
5. WHEN errors occur THEN the system SHALL log appropriate error information for debugging and improvement

### Requirement 10: Testing and Quality Assurance

**User Story:** As a developer, I want comprehensive test coverage, so that I can ensure the feature works reliably across different devices and scenarios.

#### Acceptance Criteria

1. WHEN implementing features THEN the system SHALL provide unit tests for transform accuracy and cropping persistence
2. WHEN testing notifications THEN the system SHALL verify notification timings and WhatsApp link accuracy
3. WHEN testing mobile interface THEN the system SHALL validate panel UX flows across different screen sizes
4. WHEN testing interactions THEN the system SHALL verify canvas coordinate accuracy and element positioning
5. WHEN performing integration testing THEN the system SHALL validate end-to-end workflows from design creation to export