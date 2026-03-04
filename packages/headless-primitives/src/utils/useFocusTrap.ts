import React from 'react';

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Returns focusable elements within a container, in DOM order.
 */
function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (el) => el.offsetParent !== null && !el.hasAttribute('aria-hidden')
  );
}

export interface UseFocusTrapOptions {
  /** Whether the trap is active */
  enabled?: boolean;
  /** Called when focus should return (e.g. on close). Receives the element that had focus before trap activated. */
  onDeactivate?: () => void;
  /** If true, focus is restored to the previously focused element on deactivate */
  restoreFocus?: boolean;
  /** Element to focus when trap activates. Defaults to first focusable. */
  initialFocusRef?: React.RefObject<HTMLElement | null>;
  /** Element to focus when trap deactivates. Defaults to trigger/previous element. */
  returnFocusRef?: React.RefObject<HTMLElement | null>;
}

/**
 * Focus trap for modals and overlays.
 * Per headless-a11y-primitives.mdc: Move focus to first focusable on open; trap focus inside; return focus on close.
 * APG 1.2: Dialog pattern.
 */
export function useFocusTrap(
  containerRef: React.RefObject<HTMLElement | null>,
  options: UseFocusTrapOptions = {}
) {
  const {
    enabled = true,
    onDeactivate,
    restoreFocus = true,
    initialFocusRef,
    returnFocusRef,
  } = options;

  const previousActiveElementRef = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    if (typeof document === 'undefined' || !containerRef.current || !enabled) return;

    const container = containerRef.current;

    // Store the element that had focus before trap activated
    previousActiveElementRef.current = document.activeElement as HTMLElement | null;

    // Focus initial element or first focusable
    const focusTarget =
      initialFocusRef?.current ?? getFocusableElements(container)[0] ?? container;
    if (focusTarget && typeof focusTarget.focus === 'function') {
      // Defer to avoid layout thrash
      const raf = requestAnimationFrame(() => {
        focusTarget.focus();
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [enabled, containerRef, initialFocusRef]);

  React.useEffect(() => {
    if (typeof document === 'undefined' || !containerRef.current || !enabled) return;

    const container = containerRef.current;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const focusable = getFocusableElements(container);
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const current = document.activeElement as HTMLElement;

      if (e.shiftKey) {
        if (current === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (current === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    return () => container.removeEventListener('keydown', handleKeyDown);
  }, [enabled, containerRef]);

  const deactivate = React.useCallback(() => {
    if (restoreFocus) {
      const target = returnFocusRef?.current ?? previousActiveElementRef.current;
      if (target && typeof target.focus === 'function') {
        requestAnimationFrame(() => target.focus());
      }
    }
    onDeactivate?.();
  }, [restoreFocus, returnFocusRef, onDeactivate]);

  return { deactivate };
}
