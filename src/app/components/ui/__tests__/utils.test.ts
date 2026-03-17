import { describe, it, expect } from 'vitest';
import { cn } from '../utils';

describe('cn (className merge utility)', () => {
  it('merges class names', () => {
    const result = cn('foo', 'bar');
    expect(result).toBe('foo bar');
  });

  it('handles conditional classes', () => {
    const result = cn('base', false && 'hidden', 'visible');
    expect(result).toBe('base visible');
  });

  it('handles undefined and null', () => {
    const result = cn('base', undefined, null, 'end');
    expect(result).toBe('base end');
  });

  it('merges tailwind classes correctly', () => {
    // tailwind-merge should resolve conflicts
    const result = cn('px-4 py-2', 'px-6');
    expect(result).toBe('py-2 px-6');
  });

  it('handles empty input', () => {
    const result = cn();
    expect(result).toBe('');
  });

  it('handles arrays via clsx', () => {
    const result = cn(['foo', 'bar']);
    expect(result).toBe('foo bar');
  });

  it('handles objects via clsx', () => {
    const result = cn({ active: true, disabled: false });
    expect(result).toBe('active');
  });
});
