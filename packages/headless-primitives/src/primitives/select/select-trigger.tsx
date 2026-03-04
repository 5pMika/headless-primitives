import React from 'react';
import { mergeProps } from '../../utils/slot';
import { useSelectContext } from './context';

export interface SelectTriggerProps extends React.HTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  disabled?: boolean;
}

export const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  function SelectTrigger({ asChild, children, onClick, onKeyDown, disabled, ...props }, ref) {
    const { open, onOpenChange, triggerRef } = useSelectContext();

    const composedRef = React.useCallback(
      (node: HTMLButtonElement | null) => {
        (triggerRef as React.MutableRefObject<HTMLElement | null>).current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node;
      },
      [ref, triggerRef]
    );

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) return;
      onOpenChange(!open);
      onClick?.(e);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (disabled) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onOpenChange(!open);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        onOpenChange(true);
      }
      onKeyDown?.(e);
    };

    const triggerProps = {
      ref: composedRef,
      type: 'button' as const,
      'aria-haspopup': 'listbox' as const,
      'aria-expanded': open,
      'data-state': open ? 'open' : 'closed',
      ...(disabled && { 'data-disabled': '', 'aria-disabled': true }),
      onClick: handleClick,
      onKeyDown: handleKeyDown,
      disabled,
      ...props,
    };

    if (asChild) {
      const child = React.Children.only(children);
      if (!React.isValidElement(child)) {
        return <button {...triggerProps}>{children}</button>;
      }
      const mergedProps = mergeProps(
        triggerProps as Record<string, unknown>,
        (child.props || {}) as Record<string, unknown>
      );
      return React.cloneElement(child, mergedProps);
    }

    return <button {...triggerProps}>{children}</button>;
  }
);
