import React from 'react';
import { mergeProps } from '../../utils/slot';
import { useDialogContext } from './context';

export interface DialogTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export const DialogTrigger = React.forwardRef<HTMLButtonElement, DialogTriggerProps>(
  function DialogTrigger({ asChild, children, onClick, ...props }, ref) {
    const { open, onOpenChange, triggerRef } = useDialogContext();

    const composedRef = React.useCallback(
      (node: HTMLButtonElement | null) => {
        (triggerRef as React.MutableRefObject<HTMLElement | null>).current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node;
      },
      [ref, triggerRef]
    );

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      onOpenChange(!open);
      onClick?.(e);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onOpenChange(!open);
      }
      props.onKeyDown?.(e);
    };

    const triggerProps = {
      ref: composedRef,
      type: 'button' as const,
      'aria-haspopup': 'dialog' as const,
      'aria-expanded': open,
      'data-state': open ? 'open' : 'closed',
      onClick: handleClick,
      onKeyDown: handleKeyDown,
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
