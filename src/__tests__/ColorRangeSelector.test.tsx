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
