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
    
    expect(cropButton).toBeDisabled();
    expect(textButton).toBeDisabled();
  });

  it('should not call onToolSelect for disabled tools', async () => {
    const user = userEvent.setup();
    render(<ToolsRow {...mockProps} disabled={['crop']} />);
    
    const cropButton = screen.getByLabelText(/crop tool/i);
    await user.click(cropButton);
    
    expect(mockProps.onToolSelect).not.toHaveBeenCalled();
  });

  it('should show tooltips on hover', async () => {
    const user = userEvent.setup();
    render(<ToolsRow {...mockProps} />);
    
    const moveButton = screen.getByLabelText(/move tool/i);
    await user.hover(moveButton);
    
    await waitFor(() => {
      expect(screen.getAllByText('Move')).toHaveLength(2); // One in tooltip, one in aria-label
      expect(screen.getByText('Move and transform elements')).toBeInTheDocument();
    });
  });

  it('should show keyboard shortcuts in tooltips', async () => {
    const user = userEvent.setup();
    render(<ToolsRow {...mockProps} config={{ showShortcuts: true }} />);
    
    const moveButton = screen.getByLabelText(/move tool/i);
    await user.hover(moveButton);
    
    await waitFor(() => {
      expect(screen.getAllByText('Press V')).toHaveLength(2); // One in tooltip, one in aria-label
    });
  });

  it('should hide keyboard shortcuts when disabled', async () => {
    const user = userEvent.setup();
    render(<ToolsRow {...mockProps} config={{ showShortcuts: false }} />);
    
    const moveButton = screen.getByLabelText(/move tool/i);
    await user.hover(moveButton);
    
    await waitFor(() => {
      expect(screen.queryByText('Press V')).not.toBeInTheDocument();
    });
  });

  it('should render in vertical orientation', () => {
    const { container } = render(
      <ToolsRow {...mockProps} config={{ orientation: 'vertical' }} />
    );
    
    const toolsContainer = container.firstChild;
    expect(toolsContainer).toHaveClass('flex-col');
  });

  it('should render in horizontal orientation by default', () => {
    const { container } = render(<ToolsRow {...mockProps} />);
    
    const toolsContainer = container.firstChild;
    expect(toolsContainer).toHaveClass('flex-row');
  });

  it('should show labels when enabled', () => {
    render(<ToolsRow {...mockProps} config={{ showLabels: true }} />);
    
    // Labels should be visible in the DOM
    expect(screen.getByText('Move')).toBeInTheDocument();
    expect(screen.getByText('Crop')).toBeInTheDocument();
    expect(screen.getByText('Text')).toBeInTheDocument();
  });

  it('should apply different icon sizes', () => {
    const { rerender } = render(
      <ToolsRow {...mockProps} config={{ iconSize: 'sm' }} />
    );
    
    let moveButton = screen.getByLabelText(/move tool/i);
    let icon = moveButton.querySelector('svg');
    expect(icon).toHaveClass('h-4', 'w-4');
    
    rerender(<ToolsRow {...mockProps} config={{ iconSize: 'lg' }} />);
    
    moveButton = screen.getByLabelText(/move tool/i);
    icon = moveButton.querySelector('svg');
    expect(icon).toHaveClass('h-6', 'w-6');
  });

  it('should maintain 44px minimum touch targets', () => {
    render(<ToolsRow {...mockProps} />);
    
    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button).toHaveClass('min-h-[44px]', 'min-w-[44px]');
    });
  });

  it('should show active indicator for selected tool', () => {
    render(<ToolsRow {...mockProps} selectedTool="move" />);
    
    const moveButton = screen.getByLabelText(/move tool/i);
    const indicator = moveButton.querySelector('.absolute.-bottom-1');
    expect(indicator).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const { container } = render(
      <ToolsRow {...mockProps} className="custom-tools-row" />
    );
    
    expect(container.firstChild).toHaveClass('custom-tools-row');
  });

  it('should handle mouse enter and leave events', async () => {
    const user = userEvent.setup();
    render(<ToolsRow {...mockProps} />);
    
    const moveButton = screen.getByLabelText(/move tool/i);
    
    await user.hover(moveButton);
    // Button should have hover effects
    
    await user.unhover(moveButton);
    // Hover effects should be removed
  });

  it('should show separator between tool groups', () => {
    const { container } = render(<ToolsRow {...mockProps} />);
    
    const separator = container.querySelector('.bg-gray-200');
    expect(separator).toBeInTheDocument();
  });

  it('should include navigation tools after separator', () => {
    render(<ToolsRow {...mockProps} />);
    
    expect(screen.getByLabelText(/zoom tool/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/hand tool/i)).toBeInTheDocument();
  });

  it('should handle keyboard shortcuts in aria-labels', () => {
    render(<ToolsRow {...mockProps} />);
    
    const moveButton = screen.getByLabelText('Move tool (V)');
    expect(moveButton).toBeInTheDocument();
    
    const cropButton = screen.getByLabelText('Crop tool (C)');
    expect(cropButton).toBeInTheDocument();
  });

  it('should handle tools without shortcuts', () => {
    render(<ToolsRow {...mockProps} />);
    
    // Some tools might not have shortcuts, should still render properly
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });
});