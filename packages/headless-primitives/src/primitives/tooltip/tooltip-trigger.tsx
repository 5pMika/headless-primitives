import React from 'react';
import { mergeProps } from '../../utils/slot';
import { useTooltipContext } from './context';

export interface TooltipTriggerProps extends React.HTMLAttributes<HTMLElement> {
  asChild?: boolean;
}

export const TooltipTrigger = React.forwardRef<HTMLElement, TooltipTriggerProps>(
  function TooltipTrigger({ asChild, children, onPointerEnter, onPointerLeave, onFocus, onBlur, ...props }, ref) {
    const { triggerRef, contentId, scheduleOpen, scheduleClose, onOpenChange } = useTooltipContext();

    const composedRef = React.useCallback(
      (node: HTMLElement | null) => {
        (triggerRef as React.MutableRefObject<HTMLElement | null>).current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLElement | null>).current = node;
      },
      [ref, triggerRef]
    );

    const handlePointerEnter = (e: React.PointerEvent<HTMLElement>) => {
      scheduleOpen();
      onPointerEnter?.(e);
    };

    const handlePointerLeave = (e: React.PointerEvent<HTMLElement>) => {
      scheduleClose();
      onPointerLeave?.(e);
    };

    const handleFocus = (e: React.FocusEvent<HTMLElement>) => {
      onOpenChange(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLElement>) => {
      onOpenChange(false);
      onBlur?.(e);
    };

    const triggerProps = {
      ref: composedRef,
      'aria-describedby': contentId,
      onPointerEnter: handlePointerEnter,
      onPointerLeave: handlePointerLeave,
      onFocus: handleFocus,
      onBlur: handleBlur,
      ...props,
    };

    if (asChild && children) {
      const child = React.Children.only(children);
      if (!React.isValidElement(child)) {
        return <span {...triggerProps}>{children}</span>;
      }
      const mergedProps = mergeProps(
        triggerProps as Record<string, unknown>,
        (child.props || {}) as Record<string, unknown>
      );
      return React.cloneElement(child, mergedProps);
    }

    return <span {...triggerProps}>{children}</span>;
  }
);
