import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Slot } from './slot';

describe('Slot', () => {
  it('renders a div when asChild is false', () => {
    render(
      <Slot data-testid="slot">
        <span>Child</span>
      </Slot>
    );
    const slot = screen.getByTestId('slot');
    expect(slot.tagName).toBe('DIV');
    expect(slot).toHaveTextContent('Child');
  });

  it('renders a div when asChild is undefined', () => {
    render(
      <Slot data-testid="slot">
        <span>Child</span>
      </Slot>
    );
    expect(screen.getByTestId('slot').tagName).toBe('DIV');
  });

  it('merges props onto child when asChild is true', () => {
    render(
      <Slot asChild data-testid="merged">
        <button type="button">Trigger</button>
      </Slot>
    );
    const btn = screen.getByRole('button', { name: 'Trigger' });
    expect(btn).toHaveAttribute('data-testid', 'merged');
    expect(btn.tagName).toBe('BUTTON');
  });

  it('forwards ref when asChild is true', () => {
    let refValue: HTMLButtonElement | null = null;
    render(
      <Slot
        asChild
        ref={(el) => {
          refValue = el as unknown as HTMLButtonElement | null;
        }}
      >
        <button type="button">Trigger</button>
      </Slot>
    );
    const btn = screen.getByRole('button', { name: 'Trigger' });
    expect(refValue).toBe(btn);
  });
});
