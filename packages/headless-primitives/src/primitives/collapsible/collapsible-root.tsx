import React from 'react';
import { mergeProps } from '../../utils/slot';
import { useSlotId } from '../../utils/useId';
import { CollapsibleContext, type CollapsibleContextValue } from './context';

export interface CollapsibleRootProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  asChild?: boolean;
}

export const CollapsibleRoot = React.forwardRef<HTMLDivElement, CollapsibleRootProps>(
  function CollapsibleRoot(
    {
      open: openProp,
      defaultOpen = false,
      onOpenChange,
      disabled = false,
      asChild,
      children,
      ...props
    },
    ref
  ) {
    const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
    const isControlled = openProp !== undefined;
    const open = isControlled ? openProp : internalOpen;

    const contentId = useSlotId(undefined);
    const triggerId = useSlotId(undefined);

    const handleOpenChange = React.useCallback(
      (next: boolean) => {
        if (!isControlled) setInternalOpen(next);
        onOpenChange?.(next);
      },
      [isControlled, onOpenChange]
    );

    const contextValue: CollapsibleContextValue = React.useMemo(
      () => ({
        open,
        onOpenChange: handleOpenChange,
        disabled,
        contentId,
        triggerId,
      }),
      [open, handleOpenChange, disabled, contentId, triggerId]
    );

    const rootProps = {
      ref,
      'data-state': open ? 'open' : 'closed',
      ...(disabled && { 'data-disabled': '' }),
      ...props,
    };

    if (asChild) {
      const child = React.Children.only(children);
      if (!React.isValidElement(child)) {
        return (
          <CollapsibleContext.Provider value={contextValue}>
            <div {...rootProps}>
              {children}
            </div>
          </CollapsibleContext.Provider>
        );
      }
      const mergedProps = mergeProps(
        rootProps as Record<string, unknown>,
        (child.props || {}) as Record<string, unknown>
      );
      return (
        <CollapsibleContext.Provider value={contextValue}>
          {React.cloneElement(child, mergedProps)}
        </CollapsibleContext.Provider>
      );
    }

    return (
      <CollapsibleContext.Provider value={contextValue}>
        <div {...rootProps}>
          {children}
        </div>
      </CollapsibleContext.Provider>
    );
  }
);
