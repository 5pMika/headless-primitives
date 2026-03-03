import React from 'react';

/**
 * Returns whether the user prefers reduced motion.
 * Defaults to true during SSR to avoid hydration mismatch and to err on the side of accessibility.
 */
export function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(true);

  React.useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);

    const handler = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return prefersReducedMotion;
}
