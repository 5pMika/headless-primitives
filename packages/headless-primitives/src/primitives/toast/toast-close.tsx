import React from 'react';
import { mergeProps } from '../../utils/slot';
import { useToastRootContext } from './context';

export interface ToastCloseProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export const ToastClose = React.forwardRef<HTMLButtonElement, ToastCloseProps>(
  function ToastClose({ asChild = false, children, onClick, ...props }, ref) {
    const { onClose } = useToastRootContext();

    const handleClick = React.useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        onClose();
        onClick?.(e);
      },
      [onClose, onClick]
    );

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
