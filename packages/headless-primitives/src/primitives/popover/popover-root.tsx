import React from 'react';
import { PopoverContext, type PopoverContextValue } from './context';

export interface PopoverRootProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  modal?: boolean;
  children: React.ReactNode;
}

export const PopoverRoot = React.forwardRef<HTMLDivElement, PopoverRootProps>(
  function PopoverRoot(
    {
      open: openProp,
      defaultOpen = false,
      onOpenChange,
      modal = false,
      children,
    },
    ref
  ) {
    const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
    const isControlled = openProp !== undefined;
    const open = isControlled ? openProp : internalOpen;

    const triggerRef = React.useRef<HTMLElement | null>(null);
    const anchorRef = React.useRef<HTMLElement | null>(null);

    const handleOpenChange = React.useCallback(
      (next: boolean) => {
        if (!isControlled) setInternalOpen(next);
        onOpenChange?.(next);
        if (!next) {
          requestAnimationFrame(() => {
            triggerRef.current?.focus();
          });
        }
      },
      [isControlled, onOpenChange]
    );

    const contextValue: PopoverContextValue = React.useMemo(
      () => ({
        open,
        onOpenChange: handleOpenChange,
        modal,
        triggerRef,
        anchorRef,
      }),
      [open, handleOpenChange, modal]
    );

    return (
      <PopoverContext.Provider value={contextValue}>
        <div ref={ref} data-popover-root>
          {children}
        </div>
      </PopoverContext.Provider>
    );
  }
);
