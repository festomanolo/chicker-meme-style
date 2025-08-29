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
