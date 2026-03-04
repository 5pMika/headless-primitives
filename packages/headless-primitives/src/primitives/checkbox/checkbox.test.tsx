import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { Checkbox } from './checkbox';

describe('Checkbox', () => {
  it('renders unchecked by default', () => {
    render(<Checkbox.Root />);
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'false');
    expect(screen.getByRole('checkbox')).toHaveAttribute('data-state', 'unchecked');
  });

  it('toggles on click', () => {
    render(<Checkbox.Root defaultChecked={false} />);
    const el = screen.getByRole('checkbox');
    fireEvent.click(el);
    expect(el).toHaveAttribute('aria-checked', 'true');
    fireEvent.click(el);
    expect(el).toHaveAttribute('aria-checked', 'false');
  });

  it('supports indeterminate state', () => {
    render(<Checkbox.Root checked="indeterminate" />);
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'mixed');
    expect(screen.getByRole('checkbox')).toHaveAttribute('data-state', 'indeterminate');
  });

  it('has no a11y violations', async () => {
    const { container } = render(<Checkbox.Root aria-label="Checkbox" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
