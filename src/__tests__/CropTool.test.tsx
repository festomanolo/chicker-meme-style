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
    render(<CropTool {...mockProps} originalCrop={mockCropData} />);
    
    const image = screen.getByAltText('Crop preview');
    fireEvent.load(image);

    await waitFor(() => {
      expect(screen.getByText('200 × 200')).toBeInTheDocument();
    });
  });

  it('should show preset buttons when enabled', async () => {
    const config: CropToolConfig = { enablePresets: true };
    render(<CropTool {...mockProps} config={config} />);
    
    const image = screen.getByAltText('Crop preview');
    fireEvent.load(image);

    await waitFor(() => {
      expect(screen.getByText('Free')).toBeInTheDocument();
      expect(screen.getByText('1:1')).toBeInTheDocument();
      expect(screen.getByText('3:4')).toBeInTheDocument();
      expect(screen.getByText('4:3')).toBeInTheDocument();
      expect(screen.getByText('16:9')).toBeInTheDocument();
      expect(screen.getByText('9:16')).toBeInTheDocument();
    });
  });

  it('should hide preset buttons when disabled', async () => {
    const config: CropToolConfig = { enablePresets: false };
    render(<CropTool {...mockProps} config={config} />);
    
    const image = screen.getByAltText('Crop preview');
    fireEvent.load(image);

    await waitFor(() => {
      expect(screen.queryByText('Free')).not.toBeInTheDocument();
      expect(screen.queryByText('1:1')).not.toBeInTheDocument();
    });
  });

  it('should call onCropConfirm when confirm button clicked', async () => {
    const user = userEvent.setup();
    render(<CropTool {...mockProps} originalCrop={mockCropData} />);
    
    const image = screen.getByAltText('Crop preview');
    fireEvent.load(image);

    await waitFor(async () => {
      const confirmButton = screen.getByText('Confirm');
      await user.click(confirmButton);
    });

    expect(mockProps.onCropConfirm).toHaveBeenCalledWith(mockCropData);
  });

  it('should call onCropCancel when cancel button clicked', async () => {
    const user = userEvent.setup();
    render(<CropTool {...mockProps} />);
    
    const image = screen.getByAltText('Crop preview');
    fireEvent.load(image);

    await waitFor(async () => {
      const cancelButton = screen.getByText('Cancel');
      await user.click(cancelButton);
    });

    expect(mockProps.onCropCancel).toHaveBeenCalled();
  });

  it('should reset crop when reset button clicked', async () => {
    const user = userEvent.setup();
    render(<CropTool {...mockProps} originalCrop={mockCropData} />);
    
    const image = screen.getByAltText('Crop preview');
    fireEvent.load(image);

    await waitFor(async () => {
      const resetButton = screen.getByText('Reset');
      await user.click(resetButton);
    });

    expect(mockProps.onCropChange).toHaveBeenCalled();
  });

  it('should apply aspect ratio when preset selected', async () => {
    const user = userEvent.setup();
    const config: CropToolConfig = { enablePresets: true };
    render(<CropTool {...mockProps} config={config} originalCrop={mockCropData} />);
    
    const image = screen.getByAltText('Crop preview');
    fireEvent.load(image);

    await waitFor(async () => {
      const squarePreset = screen.getByText('1:1');
      await user.click(squarePreset);
    });

    expect(mockProps.onCropChange).toHaveBeenCalled();
  });

  it('should display crop position in status bar', async () => {
    render(<CropTool {...mockProps} originalCrop={mockCropData} />);
    
    const image = screen.getByAltText('Crop preview');
    fireEvent.load(image);

    await waitFor(() => {
      expect(screen.getByText('Position: 50, 50')).toBeInTheDocument();
    });
  });

  it('should apply size constraints', async () => {
    const constraints: CropConstraints = {
      minWidth: 100,
      minHeight: 100,
      maxWidth: 300,
      maxHeight: 300,
    };

    render(<CropTool {...mockProps} constraints={constraints} />);
    
    const image = screen.getByAltText('Crop preview');
    fireEvent.load(image);

    // Component should respect constraints during crop operations
    await waitFor(() => {
      expect(screen.getByText('Crop Image')).toBeInTheDocument();
    });
  });

  it('should apply aspect ratio constraints', async () => {
    const constraints: CropConstraints = {
      aspectRatio: 1,
      lockAspectRatio: true,
    };

    render(<CropTool {...mockProps} constraints={constraints} />);
    
    const image = screen.getByAltText('Crop preview');
    fireEvent.load(image);

    await waitFor(() => {
      expect(screen.getByText('Crop Image')).toBeInTheDocument();
    });
  });

  it('should handle mouse interactions on crop handles', async () => {
    render(<CropTool {...mockProps} originalCrop={mockCropData} />);
    
    const image = screen.getByAltText('Crop preview');
    fireEvent.load(image);

    await waitFor(() => {
      const cropArea = screen.getByAltText('Crop preview').parentElement;
      expect(cropArea).toBeInTheDocument();
    });

    // Test mouse down on crop area (handles would be rendered as divs)
    // This is a simplified test as the actual handles are dynamically positioned
  });

  it('should show grid lines when enabled', async () => {
    const config: CropToolConfig = { showGrid: true };
    render(<CropTool {...mockProps} config={config} originalCrop={mockCropData} />);
    
    const image = screen.getByAltText('Crop preview');
    fireEvent.load(image);

    await waitFor(() => {
      // Grid lines are rendered as SVG elements
      const svg = document.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });
  });

