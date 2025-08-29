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
