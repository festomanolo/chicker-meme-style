// Unit tests for ToolsRow component
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { ToolsRow } from '@/components/tools/ToolsRow';
import { ToolType } from '@/types/tools';

describe('ToolsRow', () => {
  const mockProps = {
    selectedTool: null as ToolType | null,
    onToolSelect: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render all default tools', () => {
    render(<ToolsRow {...mockProps} />);
    
    expect(screen.getByLabelText(/move tool/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/crop tool/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/text tool/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/image tool/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/mask tool/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/pen tool/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/eyedropper tool/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/zoom tool/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/hand tool/i)).toBeInTheDocument();
  });

  it('should highlight selected tool', () => {
    render(<ToolsRow {...mockProps} selectedTool="move" />);
    
    const moveButton = screen.getByLabelText(/move tool/i);
    expect(moveButton).toHaveClass('bg-blue-600');
  });

  it('should call onToolSelect when tool is clicked', async () => {
    const user = userEvent.setup();
    render(<ToolsRow {...mockProps} />);
    
    const cropButton = screen.getByLabelText(/crop tool/i);
    await user.click(cropButton);
    
    expect(mockProps.onToolSelect).toHaveBeenCalledWith('crop');
  });

  it('should disable specified tools', () => {
    render(<ToolsRow {...mockProps} disabled={['crop', 'text']} />);
    
    const cropButton = screen.getByLabelText(/crop tool/i);
    const textButton = screen.getByLabelText(/text tool/i);
