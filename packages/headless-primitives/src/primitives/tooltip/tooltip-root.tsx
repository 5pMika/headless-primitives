import React from 'react';
import { useSlotId } from '../../utils/useId';
import { TooltipContext } from './context';
import { useTooltipProviderContext } from './context';

export interface TooltipRootProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  delayDuration?: number;
  skipDelayDuration?: number;
  children: React.ReactNode;
}

export const TooltipRoot = React.forwardRef<HTMLDivElement, TooltipRootProps>(
  function TooltipRoot(
    {
      open: openProp,
      defaultOpen = false,
      onOpenChange,
      delayDuration: delayProp,
      skipDelayDuration: skipProp,
      children,
    },
    ref
  ) {
    const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
    const isControlled = openProp !== undefined;
    const open = isControlled ? openProp : internalOpen;

    const provider = useTooltipProviderContext();
    const delayDuration = delayProp ?? provider?.delayDuration ?? 700;
    const skipDelayDuration = skipProp ?? provider?.skipDelayDuration ?? 300;

    const triggerRef = React.useRef<HTMLElement | null>(null);
    const contentId = useSlotId(undefined);
    const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleOpenChange = React.useCallback(
      (next: boolean) => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        if (!isControlled) setInternalOpen(next);
        onOpenChange?.(next);
      },
      [isControlled, onOpenChange]
    );

    const scheduleOpen = React.useCallback(() => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => handleOpenChange(true), delayDuration);
    }, [delayDuration, handleOpenChange]);

    const scheduleClose = React.useCallback(() => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => handleOpenChange(false), skipDelayDuration);
    }, [skipDelayDuration, handleOpenChange]);

    const contextValue = React.useMemo(
      () => ({
        open,
        onOpenChange: handleOpenChange,
        triggerRef,
        contentId,
        delayDuration,
        skipDelayDuration,
        scheduleOpen,
        scheduleClose,
      }),
      [open, handleOpenChange, contentId, delayDuration, skipDelayDuration, scheduleOpen, scheduleClose]
    );

    return (
      <TooltipContext.Provider value={contextValue}>
        <div ref={ref} data-tooltip-root>
          {children}
        </div>
      </TooltipContext.Provider>
    );
  }
);
