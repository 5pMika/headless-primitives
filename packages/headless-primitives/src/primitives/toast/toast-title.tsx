import React from 'react';
import { mergeProps } from '../../utils/slot';

export interface ToastTitleProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

export const ToastTitle = React.forwardRef<HTMLDivElement, ToastTitleProps>(
  function ToastTitle({ asChild = false, children, ...props }, ref) {
    const titleProps = { ref, ...props };

    if (asChild) {
      const child = React.Children.only(children);
      if (!React.isValidElement(child)) {
        return <div {...titleProps}>{children}</div>;
      }
      const mergedProps = mergeProps(
        titleProps as Record<string, unknown>,
        (child.props || {}) as Record<string, unknown>
      );
      return React.cloneElement(child, mergedProps);
    }

    return <div {...titleProps}>{children}</div>;
  }
);
