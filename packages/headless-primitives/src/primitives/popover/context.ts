import React from 'react';

export interface PopoverContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  modal: boolean;
  triggerRef: React.RefObject<HTMLElement | null>;
  anchorRef: React.RefObject<HTMLElement | null>;
}

export const PopoverContext = React.createContext<PopoverContextValue | null>(null);

export function usePopoverContext(): PopoverContextValue {
  const ctx = React.useContext(PopoverContext);
  if (!ctx) {
    throw new Error('Popover components must be used within Popover.Root');
  }
  return ctx;
}
