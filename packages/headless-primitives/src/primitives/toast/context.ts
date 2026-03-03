import React from 'react';

export type ToastSwipeDirection = 'up' | 'down' | 'left' | 'right';

export interface ToastContextValue {
  viewportRef: React.RefObject<HTMLElement | null>;
  setViewportRef: (el: HTMLElement | null) => void;
  duration: number;
  label: string;
  swipeDirection: ToastSwipeDirection;
  swipeThreshold: number;
}

export const ToastContext = React.createContext<ToastContextValue | null>(null);

export function useToastContext(): ToastContextValue {
  const ctx = React.useContext(ToastContext);
  if (!ctx) {
    throw new Error('Toast components must be used within Toast.Provider');
  }
  return ctx;
}

export interface ToastRootContextValue {
  onClose: () => void;
}

export const ToastRootContext = React.createContext<ToastRootContextValue | null>(null);

export function useToastRootContext(): ToastRootContextValue {
  const ctx = React.useContext(ToastRootContext);
  if (!ctx) {
    throw new Error('Toast.Action and Toast.Close must be used within Toast.Root');
  }
  return ctx;
}
