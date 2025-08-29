// Unit tests for SnapGuides component
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SnapGuides } from '@/components/canvas/SnapGuides';
import { SnapGuide } from '@/types/transform';

const mockCanvasSize = { width: 800, height: 600 };

const mockGuides: SnapGuide[] = [
  {
    type: 'center',
    position: 400,
    axis: 'x',
    temporary: false,
    priority: 1,
  },
  {
    type: 'center',
    position: 300,
    axis: 'y',
    temporary: false,
    priority: 1,
  },
  {
    type: 'mockup',
    position: 200,
    axis: 'x',
    temporary: false,
    priority: 2,
  },
  {
    type: 'element',
    position: 150,
    axis: 'y',
    temporary: true,
    priority: 3,
    elementId: 'element-1',
  },
];

describe('SnapGuides', () => {
  it('should render SVG with correct dimensions', () => {
    const { container } = render(
      <SnapGuides
        guides={mockGuides}
        canvasSize={mockCanvasSize}
        zoom={1}
      />
    );

    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('width', '800');
    expect(svg).toHaveAttribute('height', '600');
  });

  it('should render guide lines for each guide', () => {
    const { container } = render(
      <SnapGuides
        guides={mockGuides}
        canvasSize={mockCanvasSize}
        zoom={1}
      />
    );

    const lines = container.querySelectorAll('line');
    // Should have lines for visible guides (center, mockup, and temporary element guide)
    expect(lines.length).toBeGreaterThan(0);
  });

  it('should render vertical lines for x-axis guides', () => {
    const xGuides: SnapGuide[] = [
      {
        type: 'center',
        position: 400,
        axis: 'x',
        temporary: true,
        priority: 1,
      },
    ];

    const { container } = render(
      <SnapGuides
        guides={xGuides}
        canvasSize={mockCanvasSize}
        zoom={1}
      />
    );

    const line = container.querySelector('line');
    expect(line).toHaveAttribute('x1', '400');
    expect(line).toHaveAttribute('x2', '400');
    expect(line).toHaveAttribute('y1', '0');
    expect(line).toHaveAttribute('y2', '600');
  });

  it('should render horizontal lines for y-axis guides', () => {
    const yGuides: SnapGuide[] = [
      {
        type: 'center',
        position: 300,
        axis: 'y',
        temporary: true,
        priority: 1,
      },
    ];

    const { container } = render(
      <SnapGuides
        guides={yGuides}
        canvasSize={mockCanvasSize}
        zoom={1}
      />
    );

    const line = container.querySelector('line');
    expect(line).toHaveAttribute('x1', '0');
    expect(line).toHaveAttribute('x2', '800');
    expect(line).toHaveAttribute('y1', '300');
    expect(line).toHaveAttribute('y2', '300');
  });

  it('should apply different styles based on guide type', () => {
    const typedGuides: SnapGuide[] = [
      {
        type: 'center',
        position: 400,
        axis: 'x',
        temporary: true,
        priority: 1,
      },
      {
        type: 'mockup',
        position: 200,
        axis: 'x',
        temporary: true,
        priority: 2,
      },
      {
        type: 'element',
        position: 100,
        axis: 'x',
        temporary: true,
        priority: 3,
      },
    ];

    const { container } = render(
      <SnapGuides
        guides={typedGuides}
        canvasSize={mockCanvasSize}
        zoom={1}
      />
    );

    const lines = container.querySelectorAll('line');
    
    // Center guide should have blue stroke
    expect(lines[0]).toHaveAttribute('stroke', '#3B82F6');
    
    // Mockup guide should have green stroke
    expect(lines[1]).toHaveAttribute('stroke', '#10B981');
    
    // Element guide should have amber stroke
    expect(lines[2]).toHaveAttribute('stroke', '#F59E0B');
  });

  it('should show grid when showGrid is true', () => {
    const { container } = render(
      <SnapGuides
        guides={[]}
        canvasSize={mockCanvasSize}
        zoom={1}
        showGrid={true}
        gridSize={50}
      />
    );

    const lines = container.querySelectorAll('line');
