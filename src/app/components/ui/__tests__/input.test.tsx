import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from '../input';

describe('Input', () => {
  it('renders a text input', () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('accepts user input', async () => {
    const user = userEvent.setup();
    render(<Input placeholder="Type here" />);
    const input = screen.getByPlaceholderText('Type here');

    await user.type(input, 'Hello Cosmos');
    expect(input).toHaveValue('Hello Cosmos');
  });

  it('handles onChange', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Input onChange={handleChange} placeholder="test" />);

    await user.type(screen.getByPlaceholderText('test'), 'a');
    expect(handleChange).toHaveBeenCalled();
  });

  it('renders as disabled', () => {
    render(<Input disabled placeholder="disabled" />);
    expect(screen.getByPlaceholderText('disabled')).toBeDisabled();
  });

  it('supports different types', () => {
    const { rerender } = render(<Input type="email" placeholder="email" />);
    expect(screen.getByPlaceholderText('email')).toHaveAttribute('type', 'email');

    rerender(<Input type="password" placeholder="password" />);
    expect(screen.getByPlaceholderText('password')).toHaveAttribute('type', 'password');

    rerender(<Input type="number" placeholder="number" />);
    expect(screen.getByPlaceholderText('number')).toHaveAttribute('type', 'number');
  });

  it('forwards ref', () => {
    const ref = vi.fn();
    render(<Input ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });

  it('applies custom className', () => {
    render(<Input className="custom-input" placeholder="styled" />);
    expect(screen.getByPlaceholderText('styled')).toHaveClass('custom-input');
  });
});
