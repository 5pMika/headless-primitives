import React from 'react';
import { mergeProps } from '../../utils/slot';
import { useToastRootContext } from './context';

export interface ToastActionProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  altText: string;
}

export const ToastAction = React.forwardRef<HTMLButtonElement, ToastActionProps>(
  function ToastAction({ asChild = false, altText, children, onClick, ...props }, ref) {
    const { onClose } = useToastRootContext();

    const handleClick = React.useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        onClose();
        onClick?.(e);
      },
      [onClose, onClick]
    );

    const actionProps = {
      ref,
      type: 'button' as const,
      'aria-label': altText,
      onClick: handleClick,
      ...props,
    };

    if (asChild) {
      const child = React.Children.only(children);
      if (!React.isValidElement(child)) {
        return (
          <button {...actionProps} aria-label={altText}>
            {children}
          </button>
        );
      }
      const mergedProps = mergeProps(
        actionProps as Record<string, unknown>,
        (child.props || {}) as Record<string, unknown>
      );
      return React.cloneElement(child, mergedProps);
    }

    return <button {...actionProps}>{children}</button>;
  }
);
