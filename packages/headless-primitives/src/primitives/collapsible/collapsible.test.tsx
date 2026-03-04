import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { Collapsible } from './collapsible';

describe('Collapsible', () => {
  it('renders and toggles', () => {
    render(
      <Collapsible.Root>
        <Collapsible.Trigger>Toggle</Collapsible.Trigger>
        <Collapsible.Content>Content</Collapsible.Content>
      </Collapsible.Root>
    );
    expect(screen.getByRole('button', { name: 'Toggle' })).toHaveAttribute(
      'aria-expanded',
      'false'
    );
    expect(screen.queryByText('Content')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Toggle' }));
    expect(screen.getByRole('button', { name: 'Toggle' })).toHaveAttribute(
      'aria-expanded',
      'true'
    );
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('has no a11y violations', async () => {
    const { container } = render(
      <Collapsible.Root defaultOpen>
        <Collapsible.Trigger>Toggle</Collapsible.Trigger>
        <Collapsible.Content>Content</Collapsible.Content>
      </Collapsible.Root>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
