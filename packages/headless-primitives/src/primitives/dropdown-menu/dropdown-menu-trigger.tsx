import React from 'react';
import { mergeProps } from '../../utils/slot';
import { useDropdownMenuContext } from './context';

export interface DropdownMenuTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export const DropdownMenuTrigger = React.forwardRef<HTMLButtonElement, DropdownMenuTriggerProps>(
  function DropdownMenuTrigger({ asChild, children, onClick, onKeyDown, disabled, ...props }, ref) {
    const { open, onOpenChange, triggerRef } = useDropdownMenuContext();

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
      'aria-haspopup': 'menu' as const,
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
