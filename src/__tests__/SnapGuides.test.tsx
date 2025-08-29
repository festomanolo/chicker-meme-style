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
