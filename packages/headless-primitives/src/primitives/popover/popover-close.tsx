import React from 'react';
import { mergeProps } from '../../utils/slot';
import { usePopoverContext } from './context';

export interface PopoverCloseProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export const PopoverClose = React.forwardRef<HTMLButtonElement, PopoverCloseProps>(
  function PopoverClose({ asChild, children, onClick, ...props }, ref) {
    const { onOpenChange } = usePopoverContext();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      onOpenChange(false);
      onClick?.(e);
    };

    const closeProps = {
      ref,
      type: 'button' as const,
      onClick: handleClick,
      ...props,
    };

    if (asChild) {
      const child = React.Children.only(children);
      if (!React.isValidElement(child)) {
        return <button {...closeProps}>{children}</button>;
      }
      const mergedProps = mergeProps(
        closeProps as Record<string, unknown>,
        (child.props || {}) as Record<string, unknown>
      );
      return React.cloneElement(child, mergedProps);
    }

    return <button {...closeProps}>{children}</button>;
  }
);
