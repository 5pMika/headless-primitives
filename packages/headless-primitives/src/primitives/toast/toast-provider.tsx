import React from 'react';
import {
  ToastContext,
  type ToastContextValue,
  type ToastSwipeDirection,
} from './context';

export interface ToastProviderProps {
  duration?: number;
  label?: string;
  swipeDirection?: ToastSwipeDirection;
  swipeThreshold?: number;
  children: React.ReactNode;
}

export function ToastProvider({
  duration = 5000,
  label = 'Notification',
  swipeDirection = 'right',
  swipeThreshold = 50,
  children,
}: ToastProviderProps) {
    const viewportRef = React.useRef<HTMLElement | null>(null);
    const [, setViewportReady] = React.useState(false);

    const setViewportRef = React.useCallback((el: HTMLElement | null) => {
      (viewportRef as React.MutableRefObject<HTMLElement | null>).current = el;
      setViewportReady(Boolean(el));
    }, []);

    const contextValue: ToastContextValue = React.useMemo(
      () => ({
        viewportRef,
        setViewportRef,
        duration,
        label,
        swipeDirection,
        swipeThreshold,
      }),
      [setViewportRef, duration, label, swipeDirection, swipeThreshold]
    );

  return (
    <ToastContext.Provider value={contextValue}>{children}</ToastContext.Provider>
  );
}
