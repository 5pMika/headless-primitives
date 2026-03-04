import React from 'react';

export interface UseEscapeKeyOptions {
  /** Whether the listener is active */
  enabled?: boolean;
  /** Callback when Escape is pressed */
  onEscape?: (event: KeyboardEvent) => void;
}

/**
 * Listens for Escape key to close overlays.
 * Per headless-a11y-primitives.mdc: Escape closes everything dismissible.
 * APG 1.2: Dialog, Popover, Menu patterns.
 */
export function useEscapeKey(options: UseEscapeKeyOptions = {}) {
  const { enabled = true, onEscape } = options;

  React.useEffect(() => {
    if (typeof document === 'undefined' || !enabled || !onEscape) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onEscape(event);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [enabled, onEscape]);
}
