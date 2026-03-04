import React from 'react';

export interface TooltipContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLElement | null>;
  contentId: string;
  scheduleOpen: () => void;
  scheduleClose: () => void;
}

export const TooltipContext = React.createContext<TooltipContextValue | null>(null);

export function useTooltipContext(): TooltipContextValue {
  const ctx = React.useContext(TooltipContext);
  if (!ctx) {
    throw new Error('Tooltip components must be used within Tooltip.Root');
  }
  return ctx;
}

export interface TooltipProviderContextValue {
  delayDuration: number;
  skipDelayDuration: number;
}

export const TooltipProviderContext = React.createContext<TooltipProviderContextValue | null>(null);

export function useTooltipProviderContext(): TooltipProviderContextValue | null {
  return React.useContext(TooltipProviderContext);
}
