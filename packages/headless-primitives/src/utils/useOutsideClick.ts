import React from 'react';

export interface UseOutsideClickOptions {
  /** Whether the listener is active */
  enabled?: boolean;
  /** Callback when a pointer down occurs outside the element */
  onOutsideClick?: (event: PointerEvent) => void;
  /** Ref to the element that triggers the overlay (excluded from "outside") */
  triggerRef?: React.RefObject<HTMLElement | null>;
  /** Refs to additional elements to exclude (e.g. nested overlays) */
  excludeRefs?: React.RefObject<HTMLElement | null>[];
}

/**
 * Detects pointer down outside a container.
 * Used for Popover, Dropdown Menu, etc. to close on outside click.
 * Per headless-a11y-primitives.mdc: Return focus to trigger on outside click.
 */
export function useOutsideClick(
  containerRef: React.RefObject<HTMLElement | null>,
  options: UseOutsideClickOptions = {}
) {
  const { enabled = true, onOutsideClick, triggerRef, excludeRefs = [] } = options;

  React.useEffect(() => {
    if (typeof document === 'undefined' || !enabled || !onOutsideClick) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      const container = containerRef.current;
      if (!container || container.contains(target)) return;
      if (triggerRef?.current?.contains(target)) return;
      for (const ref of excludeRefs) {
        if (ref?.current?.contains(target)) return;
      }
      onOutsideClick(event);
    };

    document.addEventListener('pointerdown', handlePointerDown, true);
    return () => document.removeEventListener('pointerdown', handlePointerDown, true);
  }, [enabled, containerRef, onOutsideClick, triggerRef, excludeRefs]);
}
