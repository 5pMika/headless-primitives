import React from 'react';
import { mergeProps } from '../../utils/slot';
import { useCollapsibleContext } from './context';

export interface CollapsibleTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export const CollapsibleTrigger = React.forwardRef<HTMLButtonElement, CollapsibleTriggerProps>(
  function CollapsibleTrigger({ asChild, children, onClick, ...props }, ref) {
    const { open, onOpenChange, disabled, contentId, triggerId } = useCollapsibleContext();

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
      }
      props.onKeyDown?.(e);
    };

    const triggerProps = {
      ref,
      type: 'button' as const,
      id: triggerId,
      'aria-expanded': open,
      'aria-controls': contentId,
      'data-state': open ? 'open' : 'closed',
      ...(disabled && { 'data-disabled': '', disabled: true }),
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
