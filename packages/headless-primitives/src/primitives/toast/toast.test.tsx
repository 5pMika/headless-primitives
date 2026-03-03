import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Toast } from './toast';

describe('Toast', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders Provider + Viewport + Root with Title and Description', () => {
    render(
      <Toast.Provider>
        <Toast.Viewport />
        <Toast.Root>
          <Toast.Title>Saved!</Toast.Title>
          <Toast.Description>Your changes have been saved.</Toast.Description>
        </Toast.Root>
      </Toast.Provider>
    );
    expect(screen.getByText('Saved!')).toBeInTheDocument();
    expect(screen.getByText('Your changes have been saved.')).toBeInTheDocument();
  });

  it('closes after duration in uncontrolled mode', () => {
    render(
      <Toast.Provider duration={1000}>
        <Toast.Viewport />
        <Toast.Root>
          <Toast.Title>Saved!</Toast.Title>
        </Toast.Root>
      </Toast.Provider>
    );
    expect(screen.getByText('Saved!')).toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.queryByText('Saved!')).not.toBeInTheDocument();
  });

  it('supports controlled open state', () => {
    const onOpenChange = vi.fn();
    render(
      <Toast.Provider>
        <Toast.Viewport />
        <Toast.Root open={true} onOpenChange={onOpenChange}>
          <Toast.Title>Controlled</Toast.Title>
        </Toast.Root>
      </Toast.Provider>
    );
    expect(screen.getByText('Controlled')).toBeInTheDocument();
    fireEvent.keyDown(screen.getByRole('status'), { key: 'Escape' });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('pauses timer on hover', () => {
    render(
      <Toast.Provider duration={1000}>
        <Toast.Viewport />
        <Toast.Root>
          <Toast.Title>Hover me</Toast.Title>
        </Toast.Root>
      </Toast.Provider>
    );
    const toast = screen.getByRole('status');
    act(() => {
      fireEvent.pointerEnter(toast);
    });
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.getByText('Hover me')).toBeInTheDocument();
    act(() => {
      fireEvent.pointerLeave(toast);
    });
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.queryByText('Hover me')).not.toBeInTheDocument();
  });

  it('closes on Escape key', () => {
    const onOpenChange = vi.fn();
    render(
      <Toast.Provider>
        <Toast.Viewport />
        <Toast.Root defaultOpen onOpenChange={onOpenChange}>
          <Toast.Title>Escape me</Toast.Title>
        </Toast.Root>
      </Toast.Provider>
    );
    fireEvent.keyDown(screen.getByRole('status'), { key: 'Escape' });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('Close button closes toast', () => {
    const onOpenChange = vi.fn();
    render(
      <Toast.Provider>
        <Toast.Viewport />
        <Toast.Root defaultOpen onOpenChange={onOpenChange}>
          <Toast.Title>Dismiss</Toast.Title>
          <Toast.Close>Dismiss</Toast.Close>
        </Toast.Root>
      </Toast.Provider>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Dismiss' }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('Action button closes toast', () => {
    const onOpenChange = vi.fn();
    render(
      <Toast.Provider>
        <Toast.Viewport />
        <Toast.Root defaultOpen onOpenChange={onOpenChange}>
          <Toast.Title>Action</Toast.Title>
          <Toast.Action altText="Undo">Undo</Toast.Action>
        </Toast.Root>
      </Toast.Provider>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Undo' }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('forceMount keeps DOM when closed', () => {
    const onOpenChange = vi.fn();
    const { container } = render(
      <Toast.Provider>
        <Toast.Viewport />
        <Toast.Root defaultOpen forceMount onOpenChange={onOpenChange}>
          <Toast.Title>Force mounted</Toast.Title>
        </Toast.Root>
      </Toast.Provider>
    );
    fireEvent.keyDown(screen.getByRole('status'), { key: 'Escape' });
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(screen.getByText('Force mounted')).toBeInTheDocument();
    const statusEl = container.querySelector('[role="status"]');
    expect(statusEl).toHaveAttribute('aria-hidden', 'true');
  });

  it('has correct ARIA attributes for screen readers', () => {
    render(
      <Toast.Provider>
        <Toast.Viewport />
        <Toast.Root>
          <Toast.Title>Saved!</Toast.Title>
          <Toast.Description>Your changes have been saved.</Toast.Description>
        </Toast.Root>
      </Toast.Provider>
    );
    const toast = screen.getByRole('status');
    expect(toast).toHaveAttribute('aria-live', 'assertive');
    expect(toast).toHaveAttribute('aria-atomic', 'true');
    expect(toast).toHaveAttribute('data-state', 'open');
  });
});
