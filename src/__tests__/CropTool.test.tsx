// Unit tests for CropTool component
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { CropTool } from '@/components/crop/CropTool';
import { CropData, CropConstraints, CropToolConfig } from '@/types/crop';

const mockImageUrl = '/test-image.jpg';

const mockCropData: CropData = {
  x: 50,
  y: 50,
  width: 200,
  height: 200,
  originalWidth: 400,
  originalHeight: 400,
};

describe('CropTool', () => {
  const mockProps = {
    imageUrl: mockImageUrl,
    onCropConfirm: jest.fn(),
    onCropCancel: jest.fn(),
    onCropChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock image loading
    Object.defineProperty(HTMLImageElement.prototype, 'naturalWidth', {
      get: () => 400,
      configurable: true,
    });
    Object.defineProperty(HTMLImageElement.prototype, 'naturalHeight', {
      get: () => 400,
      configurable: true,
    });
  });

  it('should render loading state initially', () => {
    render(<CropTool {...mockProps} />);
    expect(screen.getByText('Loading image...')).toBeInTheDocument();
  });

  it('should render crop tool after image loads', async () => {
    render(<CropTool {...mockProps} />);
    
    const image = screen.getByAltText('Crop preview');
    fireEvent.load(image);

    await waitFor(() => {
      expect(screen.getByText('Crop Image')).toBeInTheDocument();
    });
  });

  it('should display crop dimensions in toolbar', async () => {
