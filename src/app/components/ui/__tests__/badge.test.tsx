import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from '../badge';

describe('Badge', () => {
  it('renders with default variant', () => {
    render(<Badge>Default</Badge>);
    expect(screen.getByText('Default')).toBeInTheDocument();
  });

  it('renders all variants', () => {
    const variants = ['default', 'secondary', 'destructive', 'outline'] as const;
    variants.forEach((variant) => {
      const { unmount } = render(<Badge variant={variant}>{variant}</Badge>);
      expect(screen.getByText(variant)).toBeInTheDocument();
      unmount();
    });
  });

  it('applies custom className', () => {
    render(<Badge className="custom-badge">Styled</Badge>);
    expect(screen.getByText('Styled')).toHaveClass('custom-badge');
  });

  it('renders as a child element', () => {
    render(<Badge>Status: Active</Badge>);
    expect(screen.getByText('Status: Active')).toBeInTheDocument();
  });
});
