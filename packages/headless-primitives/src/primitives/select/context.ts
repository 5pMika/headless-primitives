import React from 'react';

export interface SelectContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: string | undefined;
  onValueChange: (value: string) => void;
  triggerRef: React.RefObject<HTMLElement | null>;
  contentRef: React.RefObject<HTMLElement | null>;
  focusedIndex: number;
  setFocusedIndex: (index: number) => void;
  registerItem: (ref: HTMLElement | null, value: string, disabled: boolean) => number;
  unregisterItem: (index: number) => void;
  isItemDisabled: (index: number) => boolean;
  itemRefs: React.MutableRefObject<(HTMLElement | null)[]>;
  itemValues: React.MutableRefObject<string[]>;
}

export const SelectContext = React.createContext<SelectContextValue | null>(null);

export function useSelectContext(): SelectContextValue {
  const ctx = React.useContext(SelectContext);
  if (!ctx) {
    throw new Error('Select components must be used within Select.Root');
  }
  return ctx;
}
