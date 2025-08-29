// Unit tests for ColorRangeSelector component
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { ColorRangeSelector } from '@/components/color/ColorRangeSelector';
import { TshirtColor, ColorPreset } from '@/types/color';
import { createTshirtColor } from '@/lib/color-utils';

const mockColor: TshirtColor = createTshirtColor(255, 128, 64, 'Orange');

const mockPresets: ColorPreset[] = [
  { id: 'red', name: 'Red', color: createTshirtColor(255, 0, 0, 'Red'), category: 'basic' },
  { id: 'green', name: 'Green', color: createTshirtColor(0, 255, 0, 'Green'), category: 'basic' },
  { id: 'blue', name: 'Blue', color: createTshirtColor(0, 0, 255, 'Blue'), category: 'basic' },
];

describe('ColorRangeSelector', () => {
  const mockOnColorChange = jest.fn();
  const mockOnColorValidation = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render with default props', () => {
    render(
      <ColorRangeSelector
        selectedColor={mockColor}
        onColorChange={mockOnColorChange}
      />
    );

    expect(screen.getByText('Color Selection')).toBeInTheDocument();
    expect(screen.getByText('Presets')).toBeInTheDocument();
    expect(screen.getByText('Advanced')).toBeInTheDocument();
  });

  it('should display color preview when showPreview is true', () => {
    render(
      <ColorRangeSelector
        selectedColor={mockColor}
        onColorChange={mockOnColorChange}
        showPreview={true}
      />
    );

    expect(screen.getByLabelText(`Selected color: ${mockColor.hex}`)).toBeInTheDocument();
    expect(screen.getByText(mockColor.hex)).toBeInTheDocument();
    expect(screen.getByText(`HSV(${mockColor.h}, ${mockColor.s}%, ${mockColor.v}%)`)).toBeInTheDocument();
  });

  it('should not display color preview when showPreview is false', () => {
    render(
      <ColorRangeSelector
        selectedColor={mockColor}
        onColorChange={mockOnColorChange}
        showPreview={false}
      />
    );

    expect(screen.queryByLabelText(`Selected color: ${mockColor.hex}`)).not.toBeInTheDocument();
  });

  it('should render custom preset colors', () => {
    render(
      <ColorRangeSelector
        selectedColor={mockColor}
        onColorChange={mockOnColorChange}
        presetColors={mockPresets}
      />
    );

    expect(screen.getByLabelText('Select Red color')).toBeInTheDocument();
    expect(screen.getByLabelText('Select Green color')).toBeInTheDocument();
    expect(screen.getByLabelText('Select Blue color')).toBeInTheDocument();
  });

  it('should call onColorChange when preset color is selected', async () => {
    const user = userEvent.setup();
    
    render(
      <ColorRangeSelector
        selectedColor={mockColor}
        onColorChange={mockOnColorChange}
        presetColors={mockPresets}
      />
    );

    const redButton = screen.getByLabelText('Select Red color');
    await user.click(redButton);

    expect(mockOnColorChange).toHaveBeenCalledWith(mockPresets[0].color);
  });

  it('should switch to advanced tab and show sliders', async () => {
    const user = userEvent.setup();
    
    render(
      <ColorRangeSelector
        selectedColor={mockColor}
        onColorChange={mockOnColorChange}
      />
    );

    const advancedTab = screen.getByText('Advanced');
    await user.click(advancedTab);

    expect(screen.getByText(`Hue: ${mockColor.h}°`)).toBeInTheDocument();
    expect(screen.getByText(`Saturation: ${mockColor.s}%`)).toBeInTheDocument();
    expect(screen.getByText(`Brightness: ${mockColor.v}%`)).toBeInTheDocument();
  });

  it('should update color when hue slider changes', async () => {
    const user = userEvent.setup();
    
    render(
      <ColorRangeSelector
        selectedColor={mockColor}
        onColorChange={mockOnColorChange}
      />
    );

    // Switch to advanced tab
    const advancedTab = screen.getByText('Advanced');
    await user.click(advancedTab);

    // Find and interact with hue slider
    const hueSlider = screen.getByLabelText(`Hue: ${mockColor.h}°`);
    
    // Simulate slider change (this is a simplified test - actual slider interaction is complex)
    fireEvent.change(hueSlider, { target: { value: '180' } });

    await waitFor(() => {
      expect(mockOnColorChange).toHaveBeenCalled();
    });
  });

  it('should update color when hex input changes', async () => {
    const user = userEvent.setup();
    
    render(
      <ColorRangeSelector
        selectedColor={mockColor}
        onColorChange={mockOnColorChange}
      />
    );

    // Switch to advanced tab
    const advancedTab = screen.getByText('Advanced');
    await user.click(advancedTab);

    // Find hex input
    const hexInput = screen.getByLabelText('Hex Color');
    
    // Clear and type new hex value
    await user.clear(hexInput);
    await user.type(hexInput, '#FF0000');

    await waitFor(() => {
      expect(mockOnColorChange).toHaveBeenCalled();
    });
  });

  it('should update color when RGB inputs change', async () => {
    const user = userEvent.setup();
    
    render(
      <ColorRangeSelector
        selectedColor={mockColor}
        onColorChange={mockOnColorChange}
      />
    );

    // Switch to advanced tab
    const advancedTab = screen.getByText('Advanced');
    await user.click(advancedTab);

    // Find RGB inputs
    const redInput = screen.getByLabelText('Red');
    
    // Change red value
    await user.clear(redInput);
    await user.type(redInput, '200');

    await waitFor(() => {
      expect(mockOnColorChange).toHaveBeenCalled();
    });
  });

  it('should validate hex input correctly', async () => {
    const user = userEvent.setup();
    
    render(
      <ColorRangeSelector
        selectedColor={mockColor}
        onColorChange={mockOnColorChange}
      />
    );

    // Switch to advanced tab
    const advancedTab = screen.getByText('Advanced');
    await user.click(advancedTab);

    // Find hex input
    const hexInput = screen.getByLabelText('Hex Color');
    
    // Type invalid hex value
    await user.clear(hexInput);
    await user.type(hexInput, '#INVALID');

    // Should not call onColorChange for invalid hex
    await waitFor(() => {
      expect(mockOnColorChange).not.toHaveBeenCalledWith(
        expect.objectContaining({ hex: '#INVALID' })
      );
    });
  });

  it('should clamp RGB values to valid range', async () => {
    const user = userEvent.setup();
    
    render(
      <ColorRangeSelector
        selectedColor={mockColor}
        onColorChange={mockOnColorChange}
      />
    );

    // Switch to advanced tab
    const advancedTab = screen.getByText('Advanced');
    await user.click(advancedTab);

    // Find RGB inputs
    const redInput = screen.getByLabelText('Red');
    
    // Try to enter value above 255
    await user.clear(redInput);
    await user.type(redInput, '300');

    // Should clamp to 255
    await waitFor(() => {
      expect(redInput).toHaveValue(255);
    });
  });

  it('should call onColorValidation when provided', () => {
    render(
      <ColorRangeSelector
        selectedColor={mockColor}
        onColorChange={mockOnColorChange}
        onColorValidation={mockOnColorValidation}
      />
    );

    expect(mockOnColorValidation).toHaveBeenCalledWith(true, []);
  });

  it('should reset color when reset button is clicked', async () => {
    const user = userEvent.setup();
    
    render(
      <ColorRangeSelector
        selectedColor={mockColor}
