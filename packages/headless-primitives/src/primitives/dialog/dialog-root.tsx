import React from 'react';
import { useSlotId } from '../../utils/useId';
import { DialogContext, type DialogContextValue } from './context';

export interface DialogRootProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  modal?: boolean;
  children: React.ReactNode;
}

export const DialogRoot = React.forwardRef<HTMLDivElement, DialogRootProps>(
  function DialogRoot(
    {
      open: openProp,
      defaultOpen = false,
      onOpenChange,
      modal = true,
      children,
    },
    ref
  ) {
    const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
    const isControlled = openProp !== undefined;
    const open = isControlled ? openProp : internalOpen;

    const triggerRef = React.useRef<HTMLElement | null>(null);
    const contentId = useSlotId(undefined);
    const titleId = useSlotId(undefined);
    const descriptionId = useSlotId(undefined);

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

    const contextValue: DialogContextValue = React.useMemo(
      () => ({
        open,
        onOpenChange: handleOpenChange,
        modal,
        triggerRef,
        contentId,
        titleId,
        descriptionId,
      }),
      [open, handleOpenChange, modal, contentId, titleId, descriptionId]
    );

    return (
      <DialogContext.Provider value={contextValue}>
        <div ref={ref} data-dialog-root>
          {children}
        </div>
      </DialogContext.Provider>
    );
  }
);
