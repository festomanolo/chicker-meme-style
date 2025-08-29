// Unit tests for PhotorealisticMockup component
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PhotorealisticMockup } from '@/components/mockup/PhotorealisticMockup';
import { TshirtMockup } from '@/types/mockup';

// Mock the mockup loader
jest.mock('@/lib/mockup-loader', () => ({
  loadMockup: jest.fn(),
}));

import { loadMockup } from '@/lib/mockup-loader';
const mockLoadMockup = loadMockup as jest.MockedFunction<typeof loadMockup>;

const mockMockup: TshirtMockup = {
  id: 'test-mockup',
  name: 'Test Mockup',
  type: 'front',
  category: 'regular',
  variants: {
    '1x': '/test-1x.webp',
    '2x': '/test-2x.webp',
    '3x': '/test-3x.webp',
  },
  maskUrl: '/test-mask.png',
  designArea: {
    x: 160,
    y: 120,
    width: 200,
    height: 240,
    curvature: {
      points: [
        { x: 0, y: 0 },
        { x: 200, y: 0 },
        { x: 200, y: 240 },
        { x: 0, y: 240 },
      ],
      closed: true,
    },
  },
  metadata: {
    originalWidth: 520,
    originalHeight: 600,
    designAreaRatio: 0.38,
    shadowIntensity: 0.3,
    fabricTexture: 'cotton-medium',
  },
};

describe('PhotorealisticMockup', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render loading state initially', () => {
    mockLoadMockup.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(<PhotorealisticMockup mockup={mockMockup} />);

    expect(screen.getByText('Loading Test Mockup...')).toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument(); // Loader2 icon
  });

  it('should render mockup image after successful load', async () => {
    mockLoadMockup.mockResolvedValue({
      url: '/test-2x.webp',
      width: 1040,
      height: 1200,
      loaded: true,
    });

    render(<PhotorealisticMockup mockup={mockMockup} />);

    await waitFor(() => {
      expect(screen.getByAltText('Test Mockup')).toBeInTheDocument();
    });

    const img = screen.getByAltText('Test Mockup') as HTMLImageElement;
    expect(img.src).toContain('/test-2x.webp');
  });

  it('should render error state on load failure', async () => {
    mockLoadMockup.mockResolvedValue({
      url: '/test-2x.webp',
      width: 0,
      height: 0,
      loaded: false,
      error: 'Network error',
    });

    render(<PhotorealisticMockup mockup={mockMockup} />);

    await waitFor(() => {
      expect(screen.getByText('Failed to load mockup')).toBeInTheDocument();
      expect(screen.getByText('Network error')).toBeInTheDocument();
    });
  });

  it('should call onLoad callback on successful load', async () => {
    const onLoad = jest.fn();
    const assetInfo = {
      url: '/test-2x.webp',
      width: 1040,
      height: 1200,
      loaded: true,
    };

    mockLoadMockup.mockResolvedValue(assetInfo);

    render(<PhotorealisticMockup mockup={mockMockup} onLoad={onLoad} />);

    await waitFor(() => {
      expect(onLoad).toHaveBeenCalledWith(assetInfo);
    });
  });

  it('should call onError callback on load failure', async () => {
    const onError = jest.fn();
    const errorMessage = 'Failed to load image';

    mockLoadMockup.mockRejectedValue(new Error(errorMessage));

    render(<PhotorealisticMockup mockup={mockMockup} onError={onError} />);

    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith(errorMessage);
    });
  });

  it('should render custom loading component when provided', () => {
    mockLoadMockup.mockImplementation(() => new Promise(() => {})); // Never resolves

    const customLoading = <div data-testid="custom-loading">Custom Loading...</div>;

    render(
      <PhotorealisticMockup 
        mockup={mockMockup} 
        loadingComponent={customLoading} 
      />
    );

    expect(screen.getByTestId('custom-loading')).toBeInTheDocument();
    expect(screen.queryByText('Loading Test Mockup...')).not.toBeInTheDocument();
  });

  it('should render custom fallback component on error when provided', async () => {
    mockLoadMockup.mockRejectedValue(new Error('Load failed'));

    const customFallback = <div data-testid="custom-fallback">Custom Error</div>;

    render(
      <PhotorealisticMockup 
        mockup={mockMockup} 
        fallbackComponent={customFallback} 
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId('custom-fallback')).toBeInTheDocument();
    });

    expect(screen.queryByText('Failed to load mockup')).not.toBeInTheDocument();
  });
