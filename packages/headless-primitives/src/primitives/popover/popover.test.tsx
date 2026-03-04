import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { Popover } from './popover';

describe('Popover', () => {
  it('renders trigger and opens on click', () => {
    render(
      <Popover.Root>
        <Popover.Trigger>Open</Popover.Trigger>
        <Popover.Portal>
          <Popover.Content>Content</Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    );
    expect(screen.getByRole('button', { name: 'Open' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Open' })).toHaveAttribute(
      'aria-expanded',
      'false'
    );

    fireEvent.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Open' })).toHaveAttribute(
      'aria-expanded',
      'true'
    );
  });

  it('closes on Close button click', () => {
    render(
      <Popover.Root>
        <Popover.Trigger>Open</Popover.Trigger>
        <Popover.Portal>
          <Popover.Content>
            <Popover.Close>Close</Popover.Close>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('supports controlled open', () => {
    const onOpenChange = vi.fn();
    render(
      <Popover.Root open={false} onOpenChange={onOpenChange}>
        <Popover.Trigger>Open</Popover.Trigger>
        <Popover.Portal>
          <Popover.Content>Content</Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Open' }));
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it('has data-side and data-align on content', () => {
    render(
      <Popover.Root defaultOpen>
        <Popover.Trigger>Open</Popover.Trigger>
        <Popover.Portal>
          <Popover.Content side="top" align="start">
            Content
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    );
    const content = screen.getByRole('dialog');
    expect(content).toHaveAttribute('data-side', 'top');
    expect(content).toHaveAttribute('data-align', 'start');
  });

  it('has no a11y violations for basic render', async () => {
    const { container } = render(
      <Popover.Root defaultOpen>
        <Popover.Trigger>Open</Popover.Trigger>
        <Popover.Portal>
          <Popover.Content>Content</Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
