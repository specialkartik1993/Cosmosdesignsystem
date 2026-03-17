import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Separator } from '../separator';

describe('Separator', () => {
  it('renders a horizontal separator by default', () => {
    const { container } = render(<Separator />);
    const separator = container.firstChild as HTMLElement;
    expect(separator).toBeInTheDocument();
    expect(separator.getAttribute('data-orientation')).toBe('horizontal');
  });

  it('renders a vertical separator', () => {
    const { container } = render(<Separator orientation="vertical" />);
    const separator = container.firstChild as HTMLElement;
    expect(separator.getAttribute('data-orientation')).toBe('vertical');
  });

  it('applies custom className', () => {
    const { container } = render(<Separator className="my-separator" />);
    expect(container.firstChild).toHaveClass('my-separator');
  });

  it('has correct role', () => {
    const { container } = render(<Separator />);
    const separator = container.firstChild as HTMLElement;
    expect(separator.getAttribute('role')).toBe('none');
  });
});
