// Unit tests for MobileEditingPanel component
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { MobileEditingPanel, useMobileEditingPanel } from '@/components/mobile/MobileEditingPanel';
import { renderHook, act } from '@testing-library/react';

// Mock window dimensions
const mockWindowDimensions = (width: number, height: number) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height,
  });
};

describe('MobileEditingPanel', () => {
  const mockProps = {
    isOpen: true,
    onClose: jest.fn(),
    children: <div>Panel Content</div>,
    title: 'Test Panel',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockWindowDimensions(375, 667); // iPhone dimensions
  });

  it('should render panel when open', () => {
    render(<MobileEditingPanel {...mockProps} />);
    
    expect(screen.getByText('Test Panel')).toBeInTheDocument();
    expect(screen.getByText('Panel Content')).toBeInTheDocument();
  });

  it('should not render panel content when closed', () => {
    render(<MobileEditingPanel {...mockProps} isOpen={false} />);
    
    expect(screen.queryByText('Panel Content')).not.toBeInTheDocument();
  });

  it('should call onClose when close button clicked', async () => {
    const user = userEvent.setup();
    render(<MobileEditingPanel {...mockProps} />);
    
    const closeButton = screen.getByRole('button');
