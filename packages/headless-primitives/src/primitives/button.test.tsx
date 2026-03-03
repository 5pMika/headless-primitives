import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { Button } from './button';

describe('Button', () => {
  it('renders native button with type="button"', () => {
    render(<Button>Click me</Button>);
    const btn = screen.getByRole('button', { name: 'Click me' });
    expect(btn.tagName).toBe('BUTTON');
    expect(btn).toHaveAttribute('type', 'button');
  });

  it('applies disabled and aria-disabled', () => {
    render(<Button disabled>Disabled</Button>);
    const btn = screen.getByRole('button', { name: 'Disabled' });
    expect(btn).toBeDisabled();
    expect(btn).toHaveAttribute('aria-disabled', 'true');
    expect(btn).toHaveAttribute('data-disabled', '');
  });

  it('merges props onto child when asChild is true', () => {
    render(
      <Button asChild data-testid="merged">
        <button type="button">Trigger</button>
      </Button>
    );
    const btn = screen.getByRole('button', { name: 'Trigger' });
    expect(btn).toHaveAttribute('data-testid', 'merged');
    expect(btn.tagName).toBe('BUTTON');
  });

  it('forwards ref', () => {
    let refValue: HTMLButtonElement | null = null;
    render(
      <Button
        ref={(el) => {
          refValue = el;
        }}
      >
        Click
      </Button>
    );
    const btn = screen.getByRole('button', { name: 'Click' });
    expect(refValue).toBe(btn);
  });

  it('uses provided id when given', () => {
    render(<Button id="my-button">Click</Button>);
    const btn = screen.getByRole('button', { name: 'Click' });
    expect(btn).toHaveAttribute('id', 'my-button');
  });

  it('generates id when omitted', () => {
    render(<Button>Click</Button>);
    const btn = screen.getByRole('button', { name: 'Click' });
    expect(btn.id).toBeTruthy();
  });

  it('has no a11y violations for basic render', async () => {
    const { container } = render(<Button>Click me</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
