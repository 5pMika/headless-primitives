import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { Switch } from './switch';

describe('Switch', () => {
  it('renders with unchecked state by default', () => {
    render(<Switch />);
    const el = screen.getByRole('switch');
    expect(el).toHaveAttribute('aria-checked', 'false');
    expect(el).toHaveAttribute('data-state', 'unchecked');
  });

  it('toggles on click', () => {
    render(<Switch defaultChecked={false} />);
    const el = screen.getByRole('switch');
    fireEvent.click(el);
    expect(el).toHaveAttribute('aria-checked', 'true');
    fireEvent.click(el);
    expect(el).toHaveAttribute('aria-checked', 'false');
  });

  it('calls onCheckedChange', () => {
    const onCheckedChange = vi.fn();
    render(<Switch defaultChecked={false} onCheckedChange={onCheckedChange} />);
    fireEvent.click(screen.getByRole('switch'));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    fireEvent.click(screen.getByRole('switch'));
    expect(onCheckedChange).toHaveBeenCalledWith(false);
  });

  it('supports controlled mode', () => {
    const onCheckedChange = vi.fn();
    render(<Switch checked={false} onCheckedChange={onCheckedChange} />);
    fireEvent.click(screen.getByRole('switch'));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false');
  });

  it('has no a11y violations', async () => {
    const { container } = render(<Switch aria-label="Toggle" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
