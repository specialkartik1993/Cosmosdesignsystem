import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../card';

describe('Card', () => {
  it('renders a complete card', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card description goes here.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Card body content</p>
        </CardContent>
        <CardFooter>
          <span>Footer text</span>
        </CardFooter>
      </Card>
    );

    expect(screen.getByText('Card Title')).toBeInTheDocument();
    expect(screen.getByText('Card description goes here.')).toBeInTheDocument();
    expect(screen.getByText('Card body content')).toBeInTheDocument();
    expect(screen.getByText('Footer text')).toBeInTheDocument();
  });

  it('renders card without optional sections', () => {
    render(
      <Card>
        <CardContent>
          <p>Minimal card</p>
        </CardContent>
      </Card>
    );

    expect(screen.getByText('Minimal card')).toBeInTheDocument();
  });

  it('applies custom className to Card', () => {
    const { container } = render(
      <Card className="custom-card">
        <CardContent>Content</CardContent>
      </Card>
    );

    expect(container.firstChild).toHaveClass('custom-card');
  });

  it('applies custom className to sub-components', () => {
    render(
      <Card>
        <CardHeader className="custom-header">
          <CardTitle className="custom-title">Title</CardTitle>
          <CardDescription className="custom-desc">Desc</CardDescription>
        </CardHeader>
        <CardContent className="custom-content">Body</CardContent>
        <CardFooter className="custom-footer">Foot</CardFooter>
      </Card>
    );

    expect(screen.getByText('Title')).toHaveClass('custom-title');
    expect(screen.getByText('Desc')).toHaveClass('custom-desc');
    expect(screen.getByText('Body').parentElement).toHaveClass('custom-content');
    expect(screen.getByText('Foot').parentElement).toHaveClass('custom-footer');
  });
});
