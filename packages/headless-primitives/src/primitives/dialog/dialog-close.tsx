import React from 'react';
import { mergeProps } from '../../utils/slot';
import { useDialogContext } from './context';

export interface DialogCloseProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export const DialogClose = React.forwardRef<HTMLButtonElement, DialogCloseProps>(
  function DialogClose({ asChild, children, onClick, ...props }, ref) {
    const { onOpenChange } = useDialogContext();

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
