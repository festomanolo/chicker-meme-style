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
        onTransform={mockOnTransform}
        onTransformEnd={mockOnTransformEnd}
        canvasRect={mockCanvasRect}
        zoom={1}
      />
    );

    const handle = screen.getByLabelText('Resize handle se');
    
    // Start drag
    fireEvent.mouseDown(handle, { clientX: 300, clientY: 250 });
    
    // Move mouse
    fireEvent.mouseMove(document, { clientX: 320, clientY: 270 });

    await waitFor(() => {
      expect(mockOnTransform).toHaveBeenCalled();
    });
  });

  it('should end drag operation on mouse up', async () => {
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

    const handle = screen.getByLabelText('Resize handle se');
    
    // Start and end drag
    fireEvent.mouseDown(handle, { clientX: 300, clientY: 250 });
    fireEvent.mouseMove(document, { clientX: 320, clientY: 270 });
    fireEvent.mouseUp(document);

    await waitFor(() => {
      expect(mockOnTransformEnd).toHaveBeenCalled();
    });
  });

  it('should handle touch events for mobile', async () => {
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

    const handle = screen.getByLabelText('Resize handle se');
    
    // Start touch drag
    fireEvent.touchStart(handle, {
      touches: [{ clientX: 300, clientY: 250 }],
    });
    
    // Move touch
    fireEvent.touchMove(document, {
      touches: [{ clientX: 320, clientY: 270 }],
    });

    await waitFor(() => {
      expect(mockOnTransform).toHaveBeenCalled();
    });

    // End touch
    fireEvent.touchEnd(document);

    await waitFor(() => {
      expect(mockOnTransformEnd).toHaveBeenCalled();
    });
  });

  it('should maintain aspect ratio for corner handles by default', async () => {
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

    const handle = screen.getByLabelText('Resize handle se');
    
    fireEvent.mouseDown(handle, { clientX: 300, clientY: 250 });
    fireEvent.mouseMove(document, { clientX: 340, clientY: 270 });

    await waitFor(() => {
      expect(mockOnTransform).toHaveBeenCalled();
    });

    const lastCall = mockOnTransform.mock.calls[mockOnTransform.mock.calls.length - 1][0];
    const aspectRatio = lastCall.width / lastCall.height;
    const originalAspectRatio = mockElement.width / mockElement.height;
    
    expect(aspectRatio).toBeCloseTo(originalAspectRatio, 1);
  });

  it('should allow free transform when Shift is pressed', async () => {
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

    const handle = screen.getByLabelText('Resize handle se');
    
    // Press Shift key
    fireEvent.keyDown(window, { key: 'Shift' });
    
    fireEvent.mouseDown(handle, { clientX: 300, clientY: 250 });
    fireEvent.mouseMove(document, { clientX: 340, clientY: 260 }); // Different aspect ratio

    await waitFor(() => {
      expect(mockOnTransform).toHaveBeenCalled();
    });

    // Release Shift key
    fireEvent.keyUp(window, { key: 'Shift' });
  });

  it('should handle rotation correctly', async () => {
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
    
    fireEvent.mouseDown(rotationHandle, { clientX: 200, clientY: 70 });
    fireEvent.mouseMove(document, { clientX: 250, clientY: 70 }); // Move to the right

    await waitFor(() => {
      expect(mockOnTransform).toHaveBeenCalled();
    });

    const lastCall = mockOnTransform.mock.calls[mockOnTransform.mock.calls.length - 1][0];
    expect(lastCall.rotation).toBeDefined();
    expect(typeof lastCall.rotation).toBe('number');
  });

  it('should snap rotation to 15-degree increments when close', async () => {
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
    
    // Simulate rotation close to 45 degrees
    fireEvent.mouseDown(rotationHandle, { clientX: 200, clientY: 70 });
    fireEvent.mouseMove(document, { clientX: 230, clientY: 100 });

    await waitFor(() => {
      expect(mockOnTransform).toHaveBeenCalled();
    });

    const lastCall = mockOnTransform.mock.calls[mockOnTransform.mock.calls.length - 1][0];
    // Should snap to nearest 15-degree increment
    expect(lastCall.rotation % 15).toBeCloseTo(0, 0);
  });

  it('should show numeric readout during drag when enabled', async () => {
    render(
      <TransformControls
        element={mockElement}
        isSelected={true}
        onTransform={mockOnTransform}
        onTransformEnd={mockOnTransformEnd}
        canvasRect={mockCanvasRect}
        zoom={1}
        showNumericReadout={true}
      />
    );

    const handle = screen.getByLabelText('Resize handle se');
    
    fireEvent.mouseDown(handle, { clientX: 300, clientY: 250 });
    fireEvent.mouseMove(document, { clientX: 320, clientY: 270 });

    await waitFor(() => {
      expect(screen.getByText(/W:/)).toBeInTheDocument();
      expect(screen.getByText(/H:/)).toBeInTheDocument();
    });
  });

  it('should not show numeric readout when disabled', async () => {
    render(
      <TransformControls
        element={mockElement}
        isSelected={true}
