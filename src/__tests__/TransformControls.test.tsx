// Unit tests for TransformControls component
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { TransformControls } from '@/components/canvas/TransformControls';
import { TransformData } from '@/types/transform';

const mockElement = {
  id: 'test-element',
  x: 100,
  y: 100,
  width: 200,
  height: 150,
  rotation: 0,
  scaleX: 1,
  scaleY: 1,
  visible: true,
  locked: false,
};

const mockCanvasRect: DOMRect = {
  x: 0,
  y: 0,
  width: 800,
  height: 600,
  top: 0,
  left: 0,
  bottom: 600,
  right: 800,
  toJSON: () => ({}),
};

describe('TransformControls', () => {
  const mockOnTransform = jest.fn();
  const mockOnTransformEnd = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not render when element is not selected', () => {
    const { container } = render(
      <TransformControls
        element={mockElement}
        isSelected={false}
        onTransform={mockOnTransform}
        onTransformEnd={mockOnTransformEnd}
        canvasRect={mockCanvasRect}
        zoom={1}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('should render transform handles when element is selected', () => {
    render(
      <TransformControls
        element={mockElement}
        isSelected={true}
        onTransform={mockOnTransform}
        onTransformEnd={mockOnTransformEnd}
        canvasRect={mockCanvasRect}
        zoom={1}
      />
    );

    // Should render selection outline
    expect(document.querySelector('.border-blue-400')).toBeInTheDocument();

    // Should render 8 resize handles (4 corners + 4 edges)
    const handles = document.querySelectorAll('[role="button"]');
    expect(handles.length).toBeGreaterThanOrEqual(8);
  });

  it('should render rotation handle when showRotationHandle is true', () => {
    render(
      <TransformControls
        element={mockElement}
        isSelected={true}
        onTransform={mockOnTransform}
        onTransformEnd={mockOnTransformEnd}
        canvasRect={mockCanvasRect}
        zoom={1}
        showRotationHandle={true}
      />
    );

    const rotationHandle = screen.getByLabelText('Rotation handle');
    expect(rotationHandle).toBeInTheDocument();
  });

  it('should not render rotation handle when showRotationHandle is false', () => {
    render(
      <TransformControls
        element={mockElement}
        isSelected={true}
        onTransform={mockOnTransform}
        onTransformEnd={mockOnTransformEnd}
        canvasRect={mockCanvasRect}
        zoom={1}
        showRotationHandle={false}
      />
    );

    const rotationHandle = screen.queryByLabelText('Rotation handle');
    expect(rotationHandle).not.toBeInTheDocument();
  });

  it('should not render when disabled', () => {
    const { container } = render(
      <TransformControls
        element={mockElement}
        isSelected={true}
        onTransform={mockOnTransform}
        onTransformEnd={mockOnTransformEnd}
        canvasRect={mockCanvasRect}
        zoom={1}
        disabled={true}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('should scale handle size with zoom level', () => {
    const { rerender } = render(
      <TransformControls
        element={mockElement}
        isSelected={true}
        onTransform={mockOnTransform}
        onTransformEnd={mockOnTransformEnd}
        canvasRect={mockCanvasRect}
        zoom={1}
      />
    );

    const handle1 = document.querySelector('[aria-label="Resize handle nw"]') as HTMLElement;
    const originalSize = handle1?.style.width;

    rerender(
      <TransformControls
        element={mockElement}
        isSelected={true}
        onTransform={mockOnTransform}
        onTransformEnd={mockOnTransformEnd}
        canvasRect={mockCanvasRect}
        zoom={2}
      />
    );

    const handle2 = document.querySelector('[aria-label="Resize handle nw"]') as HTMLElement;
    const scaledSize = handle2?.style.width;

    // Handle should be smaller at higher zoom
    expect(parseFloat(scaledSize)).toBeLessThan(parseFloat(originalSize));
  });

  it('should start drag operation on mouse down', async () => {
    const user = userEvent.setup();
    
    render(
      <TransformControls
        element={mockElement}
        isSelected={true}
