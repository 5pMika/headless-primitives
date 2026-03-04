import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { Tooltip } from './tooltip';

describe('Tooltip', () => {
  it('renders trigger and content when open', () => {
    render(
      <Tooltip.Root defaultOpen>
        <Tooltip.Trigger>Hover me</Tooltip.Trigger>
        <Tooltip.Content>Tooltip content</Tooltip.Content>
      </Tooltip.Root>
    );
    expect(screen.getByText('Hover me')).toBeInTheDocument();
    expect(screen.getByRole('tooltip', { name: 'Tooltip content' })).toBeInTheDocument();
  });

  it('has no a11y violations', async () => {
    const { container } = render(
      <Tooltip.Root defaultOpen>
        <Tooltip.Trigger>Hover</Tooltip.Trigger>
        <Tooltip.Content>Tip</Tooltip.Content>
      </Tooltip.Root>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
