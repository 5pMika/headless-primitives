import React from 'react';

export type DropdownMenuDir = 'ltr' | 'rtl';

export interface DropdownMenuContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  modal: boolean;
  dir?: DropdownMenuDir;
  triggerRef: React.RefObject<HTMLElement | null>;
  contentRef: React.RefObject<HTMLElement | null>;
  focusedIndex: number;
  setFocusedIndex: (index: number) => void;
  registerItem: (ref: HTMLElement | null, disabled: boolean, textValue?: string) => number;
  unregisterItem: (index: number) => void;
  isItemDisabled: (index: number) => boolean;
  itemRefs: React.MutableRefObject<(HTMLElement | null)[]>;
  itemTextMap: React.MutableRefObject<Map<number, string>>;
}

export const DropdownMenuContext = React.createContext<DropdownMenuContextValue | null>(null);

export function useDropdownMenuContext(): DropdownMenuContextValue {
  const ctx = React.useContext(DropdownMenuContext);
  if (!ctx) {
    throw new Error('DropdownMenu components must be used within DropdownMenu.Root');
  }
  return ctx;
}
